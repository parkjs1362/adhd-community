-- push_subscriptions 테이블 (Web Push 알림용)
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_hash TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  subscription JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(author_hash, endpoint)
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_author ON push_subscriptions(author_hash);

-- RLS
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- 누구나 구독 등록 가능
CREATE POLICY "push_insert" ON push_subscriptions
  FOR INSERT WITH CHECK (true);

-- service_role만 읽기 가능 (anon은 읽기 불가)
CREATE POLICY "push_read_service_only" ON push_subscriptions
  FOR SELECT USING (false);

-- 자신의 구독 삭제
CREATE POLICY "push_delete_own" ON push_subscriptions
  FOR DELETE USING (true);
