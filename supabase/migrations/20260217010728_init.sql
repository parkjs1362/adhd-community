-- ADHD 커뮤니티 데이터베이스 스키마

-- 게시판
CREATE TABLE boards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 초기 게시판 데이터
INSERT INTO boards (name, slug, description, sort_order) VALUES
  ('자유게시판', 'free', 'ADHD 관련 자유로운 이야기', 1),
  ('ADHD 정보', 'info', '약물, 치료, 논문, 뉴스 등 정보 공유', 2),
  ('일상 공유', 'daily', '일상 속 ADHD 경험과 팁', 3),
  ('약물/치료 후기', 'treatment', '약물 복용, 치료 경험 후기', 4),
  ('부모 게시판', 'parents', 'ADHD 자녀를 둔 부모를 위한 공간', 5);

-- 게시글
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id UUID REFERENCES boards(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_hash TEXT NOT NULL,
  author_nickname TEXT DEFAULT '익명',
  password_hash TEXT,
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 댓글
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES comments(id),
  content TEXT NOT NULL,
  author_hash TEXT NOT NULL,
  author_nickname TEXT DEFAULT '익명',
  like_count INT DEFAULT 0,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 좋아요
CREATE TABLE likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
  target_id UUID NOT NULL,
  liker_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(target_type, target_id, liker_hash)
);

-- 신고
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  reporter_hash TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 인덱스
CREATE INDEX idx_posts_board_id ON posts(board_id, created_at DESC);
CREATE INDEX idx_posts_like_count ON posts(like_count DESC);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id, created_at ASC);
CREATE INDEX idx_likes_target ON likes(target_type, target_id);

-- RLS
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 읽기 정책
CREATE POLICY "boards_read" ON boards FOR SELECT USING (true);
CREATE POLICY "posts_read" ON posts FOR SELECT USING (NOT is_hidden);
CREATE POLICY "comments_read" ON comments FOR SELECT USING (NOT is_hidden);

-- 쓰기 정책 (anon key로 접근 가능)
CREATE POLICY "posts_insert" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "likes_insert" ON likes FOR INSERT WITH CHECK (true);
CREATE POLICY "likes_delete" ON likes FOR DELETE USING (true);
CREATE POLICY "likes_read" ON likes FOR SELECT USING (true);
CREATE POLICY "reports_insert" ON reports FOR INSERT WITH CHECK (true);

-- 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts SET view_count = view_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 좋아요 토글 함수
CREATE OR REPLACE FUNCTION toggle_like(p_target_type TEXT, p_target_id UUID, p_liker_hash TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  existing_like UUID;
BEGIN
  SELECT id INTO existing_like FROM likes
  WHERE target_type = p_target_type AND target_id = p_target_id AND liker_hash = p_liker_hash;

  IF existing_like IS NOT NULL THEN
    DELETE FROM likes WHERE id = existing_like;
    IF p_target_type = 'post' THEN
      UPDATE posts SET like_count = like_count - 1 WHERE id = p_target_id;
    ELSE
      UPDATE comments SET like_count = like_count - 1 WHERE id = p_target_id;
    END IF;
    RETURN FALSE;
  ELSE
    INSERT INTO likes (target_type, target_id, liker_hash) VALUES (p_target_type, p_target_id, p_liker_hash);
    IF p_target_type = 'post' THEN
      UPDATE posts SET like_count = like_count + 1 WHERE id = p_target_id;
    ELSE
      UPDATE comments SET like_count = like_count + 1 WHERE id = p_target_id;
    END IF;
    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 댓글 수 업데이트 트리거
CREATE OR REPLACE FUNCTION update_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_comment_count
AFTER INSERT OR DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION update_comment_count();
