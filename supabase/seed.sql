-- ADHD 커뮤니티 샘플 시드 데이터
-- 게시글 20개 + 댓글 30개
-- 사용법:
--   supabase db seed
--   또는: psql $DATABASE_URL < supabase/seed.sql
--   또는: Supabase Dashboard SQL Editor에 붙여넣기

-- ============================================================
-- 게시글 (posts) — 20개
-- ============================================================

-- [자유게시판] 4개
INSERT INTO posts (board_id, title, content, author_hash, author_nickname, view_count, like_count, created_at)
SELECT b.id,
  'ADHD 진단받은 지 1년 됐는데 아직도 적응 중이에요',
  E'작년 이맘때 처음 진단받았는데, 솔직히 진단받기 전보다 더 혼란스러운 것 같아요.\n\n약도 먹고 있고, 심리 상담도 가끔 가는데 "이 정도면 됐나?" 싶다가도 또 실수하면 자책하게 되더라고요.\n\n여기 계신 분들은 진단 후 어느 정도 지나서 안정됐다고 느끼셨나요? 아니면 지금도 그냥 같이 살아가는 느낌인가요?\n\n그냥 요즘 좀 지쳐서 글 올려봤어요.',
  'a3f9e2c1b8d74e50', '집중하는중',
  287, 18,
  now() - interval '3 days 4 hours'
FROM boards b WHERE b.slug = 'free';

INSERT INTO posts (board_id, title, content, author_hash, author_nickname, view_count, like_count, created_at)
SELECT b.id,
  'ADHD인 사람들끼리 공통점 찾아보기 (재미로)',
  E'재미로 써봐요 ㅎㅎ 저는:\n\n- 열쇠를 항상 다른 곳에 두고 찾는다\n- 여러 탭을 동시에 열어놓고 뭐 하려고 했는지 까먹는다\n- 좋아하는 거 생기면 1~2주 정도 폭발적으로 빠졌다가 식는다\n- 영화 볼 때 자막 꼭 켜야 한다\n- 중요한 거 메모해두고 그 메모를 잃어버린다\n\n여러분은요?',
  'f1a2b3c4d5e6f708', NULL,
  430, 25,
  now() - interval '5 days 11 hours'
FROM boards b WHERE b.slug = 'free';

INSERT INTO posts (board_id, title, content, author_hash, author_nickname, view_count, like_count, created_at)
SELECT b.id,
  '오늘 약 먹는 거 또 깜빡했습니다',
  E'ADHD 약을 까먹지 않으려고 알람도 맞춰놨는데\n알람 끄고 약 먹으러 가다가 그냥 출근해버렸어요...\n\n아이러니하게도 ADHD 약을 ADHD 때문에 못 먹는 상황...\n\n요즘은 약통을 칫솔 옆에 두는 방식 쓰고 있는데 그것도 가끔 실패해요.\n좋은 방법 있으신 분 공유해주세요.',
  'b2e8a1d4c7f03690', '늦게알았어요',
  195, 12,
  now() - interval '1 day 8 hours'
FROM boards b WHERE b.slug = 'free';

INSERT INTO posts (board_id, title, content, author_hash, author_nickname, view_count, like_count, created_at)
SELECT b.id,
  '직장생활 하면서 ADHD 숨기는 분들 계세요?',
  E'저는 아무한테도 말 안 하고 다니는데요.\n\n팀장도, 친한 동료도 모릅니다. 왜냐면 "그런 거 핑계 삼는 거 아니냐"는 말이 무서워서요.\n\n근데 솔직히 힘들 때가 많아요. 회의 중에 멍해지거나, 마감 전에 갑자기 다른 거 하고 있거나.\n\n직장 동료한테 커밍아웃한 분 계세요? 어떠셨어요?',
  'e5c1f9b3a02d8741', NULL,
  312, 9,
  now() - interval '8 days 2 hours'
FROM boards b WHERE b.slug = 'free';

-- [ADHD 정보] 4개
INSERT INTO posts (board_id, title, content, author_hash, author_nickname, view_count, like_count, created_at)
SELECT b.id,
  '성인 ADHD 진단 받는 방법 정리 (2026 기준)',
  E'처음 진단받으려는 분들이 많이 물어보셔서 정리해봤습니다.\n\n**진단 가능한 곳**\n- 정신건강의학과 (가장 일반적)\n- 대학병원 정신건강의학과 (대기가 길지만 검사가 꼼꼼함)\n\n**비용**\n- 초진 + 심리검사(CAARS 등): 10~15만원 정도\n- 건강보험 적용 여부는 병원마다 다름\n\n**준비물**\n- 어릴 때 성적표나 생활기록부 있으면 도움됨\n- 증상이 언제부터였는지 메모해가면 진료 시간 단축\n\n**주의**\n- "본인이 ADHD인 것 같다"고 확신하지 않아도 됨. 검사 결과로 판단하는 거라서요.\n\n더 궁금한 거 댓글로 남겨주세요!',
  'c4d5e6a1b2f38907', '뇌불꽃맘',
  387, 22,
  now() - interval '12 days 6 hours'
FROM boards b WHERE b.slug = 'info';

INSERT INTO posts (board_id, title, content, author_hash, author_nickname, view_count, like_count, created_at)
SELECT b.id,
  'ADHD와 수면장애 관련 연구 공유',
  E'최근 읽은 논문 내용 간단히 공유합니다.\n\nADHD 성인의 약 73%가 수면 문제를 동반한다는 연구가 있었어요.\n(circadian rhythm 지연 / 입면 어려움 / 수면 유지 어려움)\n\n특히 ADHD와 지연성 수면위상장애(DSPD) 사이의 연관성은 꽤 강력하게 나타나더라고요.\n멜라토닌 분비 시점 자체가 늦게 설정된 경우가 많다고.\n\n저 같은 경우도 12~1시 전에는 잠들기가 거의 불가능한데, 이게 의지력 문제가 아니라 생체 리듬 자체일 수 있다는 게 위안이 됐어요.\n\n수면 문제 있으신 분들 많죠? 어떻게 대처하시나요?',
  'a8b2c3d4e5f61078', NULL,
  143, 8,
  now() - interval '6 days 15 hours'
FROM boards b WHERE b.slug = 'info';

INSERT INTO posts (board_id, title, content, author_hash, author_nickname, view_count, like_count, created_at)
SELECT b.id,
  '콘서타 vs 메틸페니데이트 성분 정리',
  E'자주 헷갈려하시는 것 같아서 간단히 정리했어요.\n\n**콘서타(Concerta)**\n- 성분: methylphenidate (메틸페니데이트)\n- 방출 방식: OROS 서방형 (18mg/27mg/36mg/54mg)\n- 지속 시간: 약 10~12시간\n\n**페니드(Penid) / 일반 메틸페니데이트**\n- 성분: 동일 (methylphenidate)\n- 방출 방식: 속방형\n- 지속 시간: 4~6시간\n\n**결론**: 성분은 같지만 방출 방식이 다름. 콘서타가 하루 1번으로 편하지만, 속방형이 용량 조절에 유리한 경우도 있음.\n\n처방은 의사 판단 영역이니, 본인 상황을 솔직하게 전달하는 게 중요합니다.',
  'd9e0f1a2b3c45612', '카페인중독',
  256, 15,
  now() - interval '9 days 3 hours'
FROM boards b WHERE b.slug = 'info';

INSERT INTO posts (board_id, title, content, author_hash, author_nickname, view_count, like_count, created_at)
SELECT b.id,
  'ADHD에 좋다는 운동, 실제로 효과 있나요?',
  E'"운동이 ADHD에 좋다"는 말 많이 들어보셨죠?\n\n연구로는 유산소 운동이 도파민/노르에피네프린 분비를 돕고, 전두엽 기능 향상에 효과가 있다고 합니다.\n\n저는 아침 조깅 2주째 해보고 있는데, 확실히 오전 집중력이 달라지는 느낌이에요.\n다만 ADHD 특성상 루틴 유지가 어려워서... 이미 한 번 3일 끊겼다가 다시 시작한 상태입니다 😅\n\n운동으로 효과 보신 분 있으세요? 어떤 운동, 어떤 시간대가 좋으셨나요?',
  'e1f2a3b4c5d67823', NULL,
  178, 11,
  now() - interval '2 days 9 hours'
FROM boards b WHERE b.slug = 'info';

-- [일상 공유] 4개
INSERT INTO posts (board_id, title, content, author_hash, author_nickname, view_count, like_count, created_at)
SELECT b.id,
  '포모도로 타이머 1주일째 쓰고 있어요, 근데...',
  E'포모도로 기법 써보시는 분 계세요?\n\n25분 집중 → 5분 휴식 방식인데,\n저는 25분 타이머 켜놓고 "5분만 다른 거 보고 시작하자" 하다가 타이머 끝나버리는 경우가 절반이에요 ㅋㅋ\n\n그래도 아예 안 쓰는 것보다는 낫긴 한데...\n혹시 ADHD에 맞게 변형해서 쓰시는 분 계신가요?\n15분/5분 으로 줄이면 어떨까 싶기도 하고.',
  'f3a4b5c6d7e89034', '조용한ADHD',
  167, 7,
  now() - interval '4 days 12 hours'
FROM boards b WHERE b.slug = 'daily';

INSERT INTO posts (board_id, title, content, author_hash, author_nickname, view_count, like_count, created_at)
SELECT b.id,
  '오늘 처음으로 할 일 목록을 다 마쳤어요!',
  E'사소한 거지만 자랑하고 싶어서요 ㅎㅎ\n\n오늘 할 일 목록에 6개 써놨는데 진짜 다 했어요.\n중간에 딴 짓도 했고 집중 끊겼다가 다시 시작한 적도 있었는데,\n결국 다 했다는 게 너무 뿌듯해요.\n\n작은 거라도 완료할 때 체크 표시 하는 거, 생각보다 도움 많이 돼요.\n오늘 하루 수고하셨어요, 여러분!',
  'a1b2c3d4e5f60945', NULL,
  89, 21,
  now() - interval '18 hours'
FROM boards b WHERE b.slug = 'daily';

INSERT INTO posts (board_id, title, content, author_hash, author_nickname, view_count, like_count, created_at)
SELECT b.id,
  '냄비 태우는 거 저만 이렇게 자주 하나요...',
  E'오늘 물 올려놓고 핸드폰 보다가 또 태웠어요.\n이번 달만 세 번째예요.\n\n냄비가 벌써 바닥이 검게 됐고, 가스비도 더 나올 것 같고.\n\n이제 인덕션 써야 하나 진지하게 고민 중인데,\n인덕션도 타이머 설정 안 하면 똑같을 것 같아서...\n\n요리 타이머 꼭 쓰는 게 답인 건 아는데, 타이머 거는 것 자체를 까먹는 게 문제예요 🥲',
  'b3c4d5e6f7a08156', '건망증왕',
  215, 13,
  now() - interval '2 days 5 hours'
FROM boards b WHERE b.slug = 'daily';

INSERT INTO posts (board_id, title, content, author_hash, author_nickname, view_count, like_count, created_at)
SELECT b.id,
  '핸드폰 또 어디 뒀는지 모르겠어서...',
  E'핸드폰으로 전화 걸어줄 사람도 없고, 소리도 무음이라\n결국 집 안을 20분 동안 뒤집어 놨어요.\n\n(결론: 쇼파 쿠션 밑에 있었음)\n\n이런 거 반복되다 보니까 에어태그 달고 싶은데\n아이폰 전용이라 안드로이드는 못 쓰더라고요.\n\n갤럭시 스마트태그 써보신 분 계세요?\n아니면 다른 분실방지 방법 있으신가요?',
  'c5d6e7f8a9b01267', NULL,
  156, 6,
  now() - interval '7 days 21 hours'
FROM boards b WHERE b.slug = 'daily';

-- [약물/치료 후기] 4개
INSERT INTO posts (board_id, title, content, author_hash, author_nickname, view_count, like_count, created_at)
SELECT b.id,
  '메틸페니데이트 복용 3개월 후기',
  E'복용 3개월이 됐는데 솔직하게 써볼게요.\n\n**좋아진 점**\n- 회의 중 집중력 눈에 띄게 향상\n- 멀티태스킹에서 우선순위 판단이 쉬워짐\n- 미루던 일 시작하는 게 조금 수월해짐\n\n**불편한 점**\n- 오후 5시 이후 약 효과 떨어지면 피로감이 심함\n- 초반 1~2주 식욕 감소가 꽤 있었음\n- 가끔 두통 (지금은 많이 줄었음)\n\n**총평**\n약이 "완치"가 아니라 "보조 도구"라는 느낌. 약 먹어도 전략이나 습관이 없으면 한계가 있다는 걸 3개월 동안 배웠어요.',
  'd7e8f9a0b1c23478', '약먹는중',
  298, 19,
  now() - interval '11 days 8 hours'
FROM boards b WHERE b.slug = 'treatment';

INSERT INTO posts (board_id, title, content, author_hash, author_nickname, view_count, like_count, created_at)
SELECT b.id,
  '비약물 치료 — CBT 6주 다녀온 후기',
  E'약 부작용이 심해서 비약물 치료 방향으로 가보기로 하고,\nADHD 특화 인지행동치료(CBT) 프로그램 6주 다녀왔어요.\n\n**프로그램 내용**\n- 1주차: ADHD 이해 / 강점 파악\n- 2~3주차: 시간 관리 전략\n- 4~5주차: 감정 조절 / 충동성 다루기\n- 6주차: 유지 전략 / 재발 방지\n\n**느낀 점**\n기술적인 전략 자체는 유용한데, 실생활에 적용하려면 연습이 꽤 많이 필요해요.\n저한테는 약보다 효과가 덜했지만, 자기 이해 측면에서는 훨씬 도움됐어요.\n\n약물 없이 가려는 분들한테는 한 번 시도해볼 만하다고 생각해요.',
  'e9f0a1b2c3d45589', '조용한ADHD',
  201, 14,
  now() - interval '15 days 4 hours'
FROM boards b WHERE b.slug = 'treatment';

INSERT INTO posts (board_id, title, content, author_hash, author_nickname, view_count, like_count, created_at)
SELECT b.id,
  '약 끊고 난 뒤 반동 현상 있으신 분?',
  E'저약 끊고 나서 3~4일 동안 집중이 약 먹기 전보다 훨씬 더 안 됐어요.\n\n찾아보니까 "리바운드 효과"라고 하던데, 이거 원래 있는 건가요?\n\n저만 이런 건지, 아니면 약 종류나 용량 차이인지 궁금해서요.\n의사한테 물어봤는데 "사람마다 다르다"는 답변만 받아서...\n\n비슷한 경험 있으신 분 계세요?',
  'f1a2b3c4d5e66790', NULL,
  127, 5,
  now() - interval '4 days 7 hours'
FROM boards b WHERE b.slug = 'treatment';

INSERT INTO posts (board_id, title, content, author_hash, author_nickname, view_count, like_count, created_at)
SELECT b.id,
  '아토목세틴(스트라테라) 먹어본 분 계세요?',
  E'콘서타 부작용이 심해서 비자극제 계열로 바꾸는 거 고려 중이에요.\n\n스트라테라(아토목세틴)로 바꾼 분 계시면 후기 들려주세요.\n\n특히 궁금한 건:\n1. 효과 나타나기까지 얼마나 걸렸나요? (4~6주라고 하던데)\n2. 자극제 계열이랑 비교하면 집중력 차이가 어떤가요?\n3. 부작용은 어떠셨나요?\n\n뭐든 경험담 환영합니다!',
  'a3b4c5d6e7f88901', '늦게알았어요',
  183, 10,
  now() - interval '3 days 16 hours'
FROM boards b WHERE b.slug = 'treatment';

-- [부모 게시판] 4개
INSERT INTO posts (board_id, title, content, author_hash, author_nickname, view_count, like_count, created_at)
SELECT b.id,
  '초3 아이가 최근 ADHD 진단 받았어요, 어디서 시작해야 할까요?',
  E'지난주에 아이가 ADHD 진단을 받았어요. 혼합형이라고 하더라고요.\n\n학교에서 수업 중에 자꾸 돌아다니고, 숙제를 거의 못 끝내고 온다고 해서 병원에 갔는데 진단이 나왔어요.\n\n솔직히 진단 결과 받고 나서 멍하니 있었어요. 내 아이가 ADHD라는 게 실감이 안 났고, 뭘 어떻게 해야 할지 막막하고.\n\n약을 바로 시작해야 하는 건지, 행동치료를 먼저 해야 하는 건지, 학교에는 어떻게 알려야 하는지...\n\n같은 경험 있으신 부모님, 처음에 어떻게 하셨나요?',
  'b5c6d7e8f9a01012', '뇌불꽃맘',
  224, 16,
  now() - interval '6 days 10 hours'
FROM boards b WHERE b.slug = 'parents';

INSERT INTO posts (board_id, title, content, author_hash, author_nickname, view_count, like_count, created_at)
SELECT b.id,
  '아이 담임 선생님께 ADHD 알려야 할까요?',
  E'아이가 초2인데 진단받은 지 3개월 됐어요.\n\n담임 선생님께 말씀드려야 할지 고민 중이에요.\n\n말씀드리면 선생님이 좀 더 배려해주실 수 있을 것 같은데,\n반면에 "ADHD 아이"라는 낙인이 생길까봐 걱정도 돼요.\n\n담임 성향을 잘 모르는 상황에서는 어떻게 하는 게 나을까요?\n\n경험 있으신 분들 조언 부탁드려요.',
  'c7d8e9f0a1b12123', NULL,
  189, 13,
  now() - interval '9 days 2 hours'
FROM boards b WHERE b.slug = 'parents';

INSERT INTO posts (board_id, title, content, author_hash, author_nickname, view_count, like_count, created_at)
SELECT b.id,
  '약 안 먹이고 싶은데 어떻게들 결정하셨나요?',
  E'아이 나이가 8살인데, 의사 선생님이 약을 권유하셨어요.\n\n근데 솔직히 어린 나이에 뇌에 작용하는 약을 먹이는 게 너무 불안해요.\n\n한편으론 아이가 학교에서 힘들어하는 게 눈에 보이고, 자존감이 떨어지는 것도 걱정되고.\n\n주변엔 "약이 어린 뇌에 안 좋다"는 말도 있고, 의사는 "필요하면 쓰는 게 낫다"고 하고...\n\n비슷한 고민 하셨던 분들, 어떻게 결정하셨나요?',
  'd9e0f1a2b3c43234', NULL,
  275, 17,
  now() - interval '14 days 7 hours'
FROM boards b WHERE b.slug = 'parents';

INSERT INTO posts (board_id, title, content, author_hash, author_nickname, view_count, like_count, created_at)
SELECT b.id,
  '중학교 가면 나아진다는 말 믿어도 되나요?',
  E'"초등학교 때는 심하다가도 중학교 가면 좋아지는 경우가 많다"는 말을 주변에서 많이 들어요.\n\n아이가 지금 초6이라 기대를 갖게 되는데,\n실제로 그런 경험을 하신 분이 있는지 궁금해요.\n\n또는 반대로 중학교 올라가면서 더 힘들어진 경우도 있나요?\n\n현실적인 이야기 해주시면 감사하겠습니다.',
  'e1f2a3b4c5d64345', '약먹는중',
  148, 9,
  now() - interval '20 days 5 hours'
FROM boards b WHERE b.slug = 'parents';


-- ============================================================
-- 댓글 (comments) — 30개
-- 트리거(trigger_update_comment_count)가 자동으로 comment_count 갱신
-- ============================================================

-- 자유게시판 1번 글 댓글
INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  E'저도 진단받은 지 2년 됐는데 아직도 "적응 완료"라는 느낌은 없어요.\n그냥 예전엔 몰랐던 이유를 이제는 알고 살아간다는 느낌? 그 차이가 생각보다 크긴 해요.',
  'x1y2z3w4v5u67890', '집중하는중',
  now() - interval '3 days 1 hour'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'free' AND p.title = 'ADHD 진단받은 지 1년 됐는데 아직도 적응 중이에요';

INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  '힘내세요. 천천히 가도 괜찮아요. 저도 비슷한 시기에 많이 힘들었는데 지금은 그래도 많이 편해졌거든요.',
  'a2b3c4d5e6f78901', NULL,
  now() - interval '2 days 22 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'free' AND p.title = 'ADHD 진단받은 지 1년 됐는데 아직도 적응 중이에요';

INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  '진단 후 1~2년이 가장 혼란스러운 시기인 것 같아요. 자기 자신을 다시 이해하는 시간이라고 생각해요.',
  'b3c4d5e6f7a89012', '카페인중독',
  now() - interval '2 days 15 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'free' AND p.title = 'ADHD 진단받은 지 1년 됐는데 아직도 적응 중이에요';

-- 자유게시판 2번 글 댓글 (공통점 찾기)
INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  E'저는:\n- 좋아하는 노래 같은 것만 100번 반복 듣기\n- 중요한 이메일 적어도 3번 이상 다시 읽고 보내기\n- 재미없는 일은 마감 1시간 전에 초집중으로 처리하기\n\nㅋㅋㅋ 공통점 맞죠?',
  'c4d5e6f7a8b90123', '늦게알았어요',
  now() - interval '5 days 8 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'free' AND p.title = 'ADHD인 사람들끼리 공통점 찾아보기 (재미로)';

INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  '영화 자막 켜는 거 진짜 맞아요! 소리만으론 놓치는 부분이 너무 많아서...',
  'd5e6f7a8b9c01234', NULL,
  now() - interval '4 days 20 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'free' AND p.title = 'ADHD인 사람들끼리 공통점 찾아보기 (재미로)';

-- 자유게시판 3번 글 댓글 (약 깜빡)
INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  '저는 세면대 앞에 약통 놔두니까 확실히 덜 깜빡해요. 씻고 나올 때 눈에 딱 들어오거든요.',
  'e6f7a8b9c0d12345', '뇌불꽃맘',
  now() - interval '1 day 5 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'free' AND p.title = '오늘 약 먹는 거 또 깜빡했습니다';

INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  '저는 아침 커피 옆에 두니까 좋더라고요. 커피는 절대 안 잊거든요 😅',
  'f7a8b9c0d1e23456', NULL,
  now() - interval '22 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'free' AND p.title = '오늘 약 먹는 거 또 깜빡했습니다';

-- ADHD 정보 1번 글 댓글 (진단 방법)
INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  '생활기록부 챙기는 거 정말 도움됐어요! 의사 선생님이 어릴 때부터 증상이 있었는지 확인하려고 보시더라고요.',
  'a8b9c0d1e2f34567', '집중하는중',
  now() - interval '11 days 22 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'info' AND p.title = '성인 ADHD 진단 받는 방법 정리 (2026 기준)';

INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  E'추가로, 배우자나 가족이 동행하면 제3자 관찰 내용도 진료에 도움이 된다고 하더라고요.\n혼자 다 설명하기 어려울 때 같이 가면 좋아요.',
  'b9c0d1e2f3a45678', '카페인중독',
  now() - interval '10 days 14 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'info' AND p.title = '성인 ADHD 진단 받는 방법 정리 (2026 기준)';

INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  '정리 감사해요. 오래전부터 혼자 고민하다가 이번에 병원 가보기로 했는데 많이 도움됐어요.',
  'c0d1e2f3a4b56789', NULL,
  now() - interval '9 days 3 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'info' AND p.title = '성인 ADHD 진단 받는 방법 정리 (2026 기준)';

-- ADHD 정보 2번 글 댓글 (수면장애)
INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  E'저도 새벽 1시 전에 잠드는 게 거의 불가능해요.\n의사한테 말하니까 멜라토닌 처방해주셨는데 꽤 도움되더라고요.',
  'd1e2f3a4b5c67890', '약먹는중',
  now() - interval '6 days 11 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'info' AND p.title = 'ADHD와 수면장애 관련 연구 공유';

-- ADHD 정보 4번 글 댓글 (운동)
INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  '줄넘기 20분이 저한테는 효과 짱이에요. 아침에 하면 오전 집중력이 확 다르고, 가볍고 빨리 끝낼 수 있어서 루틴 유지가 쉬워요.',
  'e2f3a4b5c6d78901', '조용한ADHD',
  now() - interval '2 days 3 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'info' AND p.title = 'ADHD에 좋다는 운동, 실제로 효과 있나요?';

INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  '걷기도 도움 돼요. 생각보다 간단하고, 폰 두고 나가면 머리가 좀 정리되는 느낌이에요.',
  'f3a4b5c6d7e89012', NULL,
  now() - interval '1 day 18 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'info' AND p.title = 'ADHD에 좋다는 운동, 실제로 효과 있나요?';

-- 일상 공유 1번 글 댓글 (포모도로)
INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  '저는 15분/3분으로 줄여서 쓰고 있어요. 25분은 너무 길어서 시작 자체를 안 하게 되더라고요.',
  'a4b5c6d7e8f90123', '집중하는중',
  now() - interval '4 days 9 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'daily' AND p.title = '포모도로 타이머 1주일째 쓰고 있어요, 근데...';

INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  '"일단 1분만 집중해보자"로 시작하는 것도 방법이에요. 시작하면 모멘텀이 생기더라고요.',
  'b5c6d7e8f9a01234', NULL,
  now() - interval '3 days 17 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'daily' AND p.title = '포모도로 타이머 1주일째 쓰고 있어요, 근데...';

-- 일상 공유 2번 글 댓글 (할 일 다 마침)
INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  '와 축하해요!! 저도 오늘 2개 했는데 진심으로 기분 좋더라고요 ㅎㅎ 작은 성공이 쌓이는 거 진짜 중요한 것 같아요.',
  'c6d7e8f9a0b12345', '늦게알았어요',
  now() - interval '15 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'daily' AND p.title = '오늘 처음으로 할 일 목록을 다 마쳤어요!';

-- 일상 공유 3번 글 댓글 (냄비 태우기)
INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  '저도 똑같아요 ㅋㅋ 이제 물 올릴 때마다 "타이머 켜!" 를 소리 내서 말하는 훈련 중이에요.',
  'd7e8f9a0b1c23456', '뇌불꽃맘',
  now() - interval '2 days 2 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'daily' AND p.title = '냄비 태우는 거 저만 이렇게 자주 하나요...';

INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  '전기포트로 바꿨더니 훨씬 나아요. 자동으로 꺼지니까 최악의 상황은 막아줘요.',
  'e8f9a0b1c2d34567', NULL,
  now() - interval '1 day 20 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'daily' AND p.title = '냄비 태우는 거 저만 이렇게 자주 하나요...';

-- 약물/치료 1번 글 댓글 (3개월 후기)
INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  '"약이 완치가 아니라 보조 도구" — 이 말이 정말 공감돼요. 저도 약 먹으면 다 해결될 줄 알았는데 아니더라고요.',
  'f9a0b1c2d3e45678', '카페인중독',
  now() - interval '11 days 4 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'treatment' AND p.title = '메틸페니데이트 복용 3개월 후기';

INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  E'오후에 약 효과 떨어지는 현상 저도 있어요.\n의사한테 말씀드렸더니 저용량 속방형을 오후 2시에 추가로 처방해주셨는데 좀 나아졌어요.',
  'a0b1c2d3e4f56789', '조용한ADHD',
  now() - interval '10 days 21 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'treatment' AND p.title = '메틸페니데이트 복용 3개월 후기';

INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  '솔직한 후기 감사해요. 저도 다음 달에 시작 예정인데 마음 준비되는 것 같아요.',
  'b1c2d3e4f5a67890', NULL,
  now() - interval '9 days 12 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'treatment' AND p.title = '메틸페니데이트 복용 3개월 후기';

-- 약물/치료 3번 글 댓글 (반동 현상)
INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  '저도 그런 경험 있어요. 리바운드가 꽤 힘든 날도 있었어요. 의사한테 솔직히 말하면 용량 조절해줄 수도 있대요.',
  'c2d3e4f5a6b78901', '약먹는중',
  now() - interval '4 days 4 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'treatment' AND p.title = '약 끊고 난 뒤 반동 현상 있으신 분?';

-- 약물/치료 4번 글 댓글 (스트라테라)
INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  E'스트라테라 1년 넘게 복용 중이에요.\n1) 효과 나타나는 데 약 5~6주 걸렸어요\n2) 자극제보다 집중력 피크는 낮지만 일정하게 유지되는 느낌\n3) 초반에 메스꺼움이 있었는데 지금은 없어요',
  'd3e4f5a6b7c89012', '늦게알았어요',
  now() - interval '3 days 12 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'treatment' AND p.title = '아토목세틴(스트라테라) 먹어본 분 계세요?';

INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  '저는 콘서타에서 스트라테라로 바꿨는데, 수면 질이 훨씬 나아졌어요. 자극제 특성상 잠들기 어려웠거든요.',
  'e4f5a6b7c8d90123', NULL,
  now() - interval '3 days 7 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'treatment' AND p.title = '아토목세틴(스트라테라) 먹어본 분 계세요?';

-- 부모 게시판 1번 글 댓글 (초3 진단)
INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  E'저도 같은 나이에 아이 진단받았어요.\n처음엔 정말 막막했는데, 병원에서 부모 교육 프로그램이 있더라고요. 먼저 그걸 들었더니 훨씬 도움됐어요.',
  'f5a6b7c8d9e01234', '뇌불꽃맘',
  now() - interval '6 days 6 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'parents' AND p.title = '초3 아이가 최근 ADHD 진단 받았어요, 어디서 시작해야 할까요?';

INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  '일단 진단받은 것 자체가 첫 번째 큰 걸음이에요. 모르고 지내는 것보다 알고 대처하는 게 훨씬 낫거든요. 힘내세요!',
  'a6b7c8d9e0f12345', NULL,
  now() - interval '5 days 23 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'parents' AND p.title = '초3 아이가 최근 ADHD 진단 받았어요, 어디서 시작해야 할까요?';

-- 부모 게시판 2번 글 댓글 (담임 선생님)
INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  E'저는 알렸는데 다행히 담임 선생님이 잘 이해해주셨어요.\n자리 배치 배려나 과제 조정 같은 것도 해주셨고요.\n선생님이 열린 분이면 확실히 도움이 돼요.',
  'b7c8d9e0f1a23456', '카페인중독',
  now() - interval '8 days 22 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'parents' AND p.title = '아이 담임 선생님께 ADHD 알려야 할까요?';

INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  E'저는 진단서를 가져가서 보여드렸어요.\n막연히 말로만 하는 것보다 공식 문서가 있으니까 선생님도 진지하게 받아들이시더라고요.',
  'c8d9e0f1a2b34567', NULL,
  now() - interval '8 days 14 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'parents' AND p.title = '아이 담임 선생님께 ADHD 알려야 할까요?';

-- 부모 게시판 3번 글 댓글 (약 결정)
INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  E'저도 1년 동안 고민했어요.\n결국 아이가 학교에서 계속 힘들어하는 걸 보고 먹이기로 결정했는데,\n6개월 후에 아이 자존감이 회복된 게 느껴져서 후회는 없어요.',
  'd9e0f1a2b3c45678', '건망증왕',
  now() - interval '13 days 21 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'parents' AND p.title = '약 안 먹이고 싶은데 어떻게들 결정하셨나요?';

INSERT INTO comments (post_id, content, author_hash, author_nickname, created_at)
SELECT p.id,
  '약에 대한 걱정은 자연스러운 거예요. 의사한테 불안한 점 솔직히 물어보시면 좋겠어요. 부작용 모니터링도 같이 해주시거든요.',
  'e0f1a2b3c4d56789', '뇌불꽃맘',
  now() - interval '13 days 8 hours'
FROM posts p
JOIN boards b ON p.board_id = b.id
WHERE b.slug = 'parents' AND p.title = '약 안 먹이고 싶은데 어떻게들 결정하셨나요?';
