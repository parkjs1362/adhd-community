import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env.local') });

// ─── Supabase 클라이언트 (Service Role Key로 RLS 우회) ───
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, serviceRoleKey);

// ─── 유틸 함수 ───
function randomHash(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function randomDate(daysAgo: number): string {
  const now = Date.now();
  const past = now - daysAgo * 24 * 60 * 60 * 1000;
  const ts = past + Math.random() * (now - past);
  return new Date(ts).toISOString();
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── 닉네임 풀 ───
const NICKNAMES = [
  '산책하는고양이', '집중못하는나무늘보', 'ADHD전사', '소소한하루',
  '뇌가산만해', '약먹는사람', '치료중인곰', '멍때리는펭귄',
  '오늘도지각', '집중력0%', '책읽는달팽이', '카페인중독',
  '새벽형인간', '할일많은사람', '산만한엄마', '노력하는아빠',
  '조용한폭풍', '까먹기대장', '타이머없인못살아', '감정롤러코스터',
  '익명', '도파민헌터', '정리정돈은내일', '알람10개족',
];

// ─── 게시글 데이터 ───
interface SeedPost {
  slug: string;
  title: string;
  content: string;
  nickname?: string;
  popularity: 'hot' | 'normal' | 'new';
  daysAgo: number; // 최대 며칠 전
  comments: SeedComment[];
}

interface SeedComment {
  content: string;
  nickname?: string;
  replies?: { content: string; nickname?: string }[];
}

const SEED_POSTS: SeedPost[] = [
  // ═══════════════════════════════════════
  // 자유게시판 (free) - 12글
  // ═══════════════════════════════════════
  {
    slug: 'free',
    title: 'ADHD인 사람들 특징 맞는지 확인해봐ㅋㅋ',
    content: `ADHD인 사람 특징 모아봤는데 맞는지 확인해봐ㅋㅋㅋ

1. 뭔가 하려고 자리에 앉으면 다른 거 시작함
2. 유튜브 '한 편만' 보려다 2시간 지남
3. 대화 중에 갑자기 딴 생각 떠올라서 "아 그러고 보니~" 함
4. 물건 어디 뒀는지 하루에 5번은 까먹음
5. 뭔가 해야 하는데 뭘 해야 하는지 까먹음
6. 갑자기 새벽 3시에 방 청소 시작함

나는 6개 다 해당인데... 너네는 몇 개야?ㅋㅋ`,
    popularity: 'hot',
    daysAgo: 5,
    comments: [
      { content: '6개 다 해당ㅋㅋㅋㅋ 특히 5번 진짜 공감...' },
      { content: '3번 ㄹㅇ 대화하다가 갑자기 딴 얘기 시작해서 친구가 황당해함ㅋㅋ' },
      { content: '6번 왜 새벽에만 그런 동기부여가 오는 건지ㅠㅠ', replies: [
        { content: '밤에 도파민 나오는 거라고 하더라ㅋㅋ' },
        { content: 'ㅇㅇ 나도 새벽에만 갑자기 생산적이 됨' },
      ]},
      { content: '7번 추가요: 장바구니에 넣어놓고 안 삼ㅋㅋㅋ' },
      { content: '이거 ADHD 아닌 사람도 해당 아닌가?ㅋㅋ', replies: [
        { content: '빈도 차이가 큼... 하루에 몇 번씩이면 의심해볼 만해' },
      ]},
    ],
  },
  {
    slug: 'free',
    title: '회사에서 ADHD 커밍아웃 해본 사람?',
    content: `회사 다니는데 진짜 고민이 많아요...

집중을 잘 못해서 실수가 자주 나오고
회의 때 멍 때리는 거 팀장님이 눈치채시는 것 같고

ADHD라고 말하면 이해해주실까?
아니면 이상한 사람 취급할까봐 무서워요

회사에서 말해본 분 경험 공유해주시면 감사합니다ㅠ`,
    popularity: 'hot',
    daysAgo: 3,
    comments: [
      { content: '저는 팀장님한테만 말했는데 의외로 이해해주셨어요. 근데 사바사인 것 같아요...' },
      { content: '솔직히 안 말하는 게 나을 수도... 편견이 아직 많아서ㅠ' },
      { content: '저는 친한 동료한테만 얘기했어요. 전체 공개는 좀 리스크 있는 듯', replies: [
        { content: '동의. 신뢰할 수 있는 사람한테만 말하는 게 좋을 듯' },
      ]},
      { content: '회사 복지에 EAP(심리상담) 있으면 거기서 먼저 상담받아보세요!' },
    ],
  },
  {
    slug: 'free',
    title: 'ADHD가 장점이 되는 순간들',
    content: `맨날 단점만 얘기하니까 장점도 좀 써볼게ㅋㅋ

- 과집중 모드 들어가면 남들 8시간 할 거 3시간에 끝냄
- 새로운 아이디어가 계속 나옴 (실행은 안 하지만ㅋㅋ)
- 위기 상황에서 오히려 냉정해짐 (도파민 올라가니까)
- 공감 능력이 좋음 (감정 인지가 빠름)
- 멀티태스킹 잘함 (집중은 못 하지만 동시 처리는 됨ㅋㅋ)

여러분은 ADHD의 장점 뭐라고 생각해요?`,
    popularity: 'hot',
    daysAgo: 7,
    comments: [
      { content: '과집중 진짜 개사기임ㅋㅋ 관심 있는 거 하면 10시간도 할 수 있음' },
      { content: '위기 상황에서 냉정해지는 거 ㄹㅇ맞음. 다들 당황할 때 나만 차분ㅋㅋ' },
      { content: '창의력은 진짜 인정... 브레인스토밍 때 항상 아이디어 가장 많이 냄', replies: [
        { content: '근데 정리를 못 하는 게 함정ㅋㅋㅋ' },
      ]},
      { content: '좋은 글이네요! 저도 장점 위주로 생각하려고 노력 중이에요' },
    ],
  },
  {
    slug: 'free',
    title: '아 오늘도 약속 시간 까먹었다...',
    content: `친구랑 약속이 2시였는데
1시쯤 "아 준비해야지~" 하고 유튜브 봤는데
정신 차리니까 2시 10분이야...

급하게 나가면서 택시 탔는데 결국 30분 늦음
친구 표정이 진짜 ㅋㅋㅋ 미안해서 밥 쐈음

알람을 3개 맞춰도 왜 이러는 거지...ㅠㅠ`,
    popularity: 'normal',
    daysAgo: 2,
    comments: [
      { content: '나도ㅠㅠ 알람 울려도 "아 5분만" 하다가 30분 지남' },
      { content: '팁인데 약속 시간을 30분 일찍 적어두면 좀 나음ㅋㅋ' },
      { content: '아이폰 미리 알림 + 알람 + 캘린더 세 개 다 해도 까먹음ㅋㅋ' },
    ],
  },
  {
    slug: 'free',
    title: 'ADHD 진단받고 인생이 달라진 사람?',
    content: `30대 초반에 진단 받았는데요

어릴 때부터 산만하고 덤벙대는 성격이라고만 생각했거든요
근데 진단 받고 나서 그동안의 실수들이 다 이해가 됐어요

"아 내가 게으른 게 아니라 뇌가 다른 거였구나"

이런 깨달음 얻은 분들 계세요?
진단 전후로 뭐가 달라졌나요?`,
    popularity: 'hot',
    daysAgo: 10,
    comments: [
      { content: '저도 28에 진단 받았는데... 진짜 울었어요. 나 자체가 문제가 아니었구나 하고', replies: [
        { content: '공감ㅠㅠ 자기비하 진짜 많이 했는데 그게 아니었음' },
        { content: '저도 진단받고 첫 번째로 한 게 울기였어요ㅋㅋ' },
      ]},
      { content: '진단 후에 약 먹고 인생 달라졌어요. 처음으로 집중이 뭔지 알았음' },
      { content: '자기이해가 가장 큰 변화인 것 같아요. 대처 전략을 세울 수 있으니까' },
      { content: '가족한테 설명하니까 "그래서 그랬구나" 하면서 이해해주더라' },
    ],
  },
  {
    slug: 'free',
    title: '과집중 모드 들어가면 시간 개념이 사라짐ㅋㅋ',
    content: `어제 코딩하다가 과집중 모드 들어갔거든?

그냥 "이것만 하고 자야지~" 하고 시작했는데
다음에 시계 보니까 새벽 4시ㅋㅋㅋㅋ

중간에 화장실도 안 가고 물도 안 마시고
그냥 계속 코딩만 했음

몸은 힘든데 뇌는 행복한 이 모순적인 상태ㅋㅋ`,
    popularity: 'normal',
    daysAgo: 1,
    comments: [
      { content: '과집중 끝나고 나면 허탈감 개쩔지 않아?ㅋㅋ' },
      { content: '나는 그림 그리다가 과집중 들어가면 6시간은 기본임ㅋㅋ' },
      { content: '과집중은 양날의 검... 성과는 나지만 체력이...' },
      { content: '타이머 맞춰도 소용없는 게 과집중이지ㅋㅋ', replies: [
        { content: '과집중 상태에서 타이머 울리면 그냥 끔ㅋㅋㅋㅋ' },
      ]},
    ],
  },
  {
    slug: 'free',
    title: '비ADHD 친구들이 이해 못하는 것들',
    content: `비ADHD 친구들이 이해 못하는 것 모음ㅋㅋ

"그냥 집중하면 되지?"
→ 그게 안 되니까 ADHD인 거야...

"왜 할 일을 미루는 거야?"
→ 미루고 싶어서 미루는 게 아니라 시작을 못 하는 거야

"메모하면 되잖아"
→ 메모한 걸 까먹어ㅋㅋㅋ

"어제 얘기했잖아"
→ 워킹메모리 3초야 미안...

공감되는 사람?ㅋㅋ`,
    popularity: 'normal',
    daysAgo: 8,
    comments: [
      { content: '"그냥 집중하면 되지" 이거 들을 때마다 피 거꾸로 솟음ㅋㅋ' },
      { content: '메모한 걸 까먹는 거 진짜 공감ㅋㅋㅋ 메모장이 어딨는지도 까먹음' },
      { content: '친구가 이해하려고 노력해주면 진짜 감동이야ㅠ' },
    ],
  },
  {
    slug: 'free',
    title: 'ADHD 밈 모음 가져왔다ㅋㅋㅋ',
    content: `웃프지만 공감되는 ADHD 밈들ㅋㅋ

"내일의 나는 오늘의 나보다 유능할 거야"
→ 내일의 나: 뭐? 나 누구?

ADHD의 할일 목록:
☐ 중요한 일 하기
☐ 급한 일 하기
☑ 바닥에 있는 먼지 관찰하기

"5분만 쉬자"
→ 3시간 후

ADHD 시간 감각:
과거 = 전부 "얼마 전"
미래 = 전부 "나중에"

ㅋㅋㅋ 공감되는 거 있으면 댓글ㄱㄱ`,
    popularity: 'normal',
    daysAgo: 12,
    comments: [
      { content: '바닥 먼지 관찰ㅋㅋㅋㅋㅋ 이거 맞아 진짜로' },
      { content: '시간 감각 ㅋㅋㅋ "얼마 전"이 3년 전인 적 있음' },
      { content: '웃다가 울었다ㅋㅋㅋㅋ' },
      { content: '공유해도 될까요?ㅋㅋ 너무 공감' },
    ],
  },
  {
    slug: 'free',
    title: '진단 받기 전 나를 돌아보면...',
    content: `작년에 진단 받기 전까지 나를 돌아보면

초등학교: "산만한 애" "똑똑한데 집중을 못 해"
중학교: "노력이 부족해" "왜 맨날 까먹어?"
고등학교: 성적 들쑥날쑥, 좋아하는 과목만 잘함
대학교: 과제 마감 전날에만 과집중으로 해결
직장: 실수 잦고 멀티태스킹 힘들어서 자존감 바닥

그때 진단 받았으면 좀 달랐을까 하는 생각이 들어요
늦었다고 생각하지 않으려고 해요`,
    popularity: 'normal',
    daysAgo: 15,
    comments: [
      { content: '와 제 이야기인 줄ㅠㅠ 특히 대학교 때 마감 전날 과집중...' },
      { content: '늦지 않았어요! 저도 35에 진단 받았는데 그래도 인생이 나아지고 있어요' },
      { content: '"똑똑한데 집중을 못 해" 이거 학교 다닐 때 맨날 듣던 말이었는데...' },
    ],
  },
  {
    slug: 'free',
    title: '새해 계획 세운 사람 얼마나 지키고 있어?ㅋㅋ',
    content: `새해 계획 세우고 2월인데

1월 1일: 올해는 달라질 거야! (다짐 100%)
1월 5일: 아직 괜찮아 (다짐 80%)
1월 15일: 음... 내일부터 하자 (다짐 30%)
2월: 새해 계획이 뭐였지? (다짐 0%)

ㅋㅋㅋㅋ 나만 이래?

ADHD 새해 계획 = 연초 이벤트ㅋㅋ`,
    popularity: 'normal',
    daysAgo: 4,
    comments: [
      { content: '나만 이런 줄 알았는데ㅋㅋㅋ 동지가 있었구나' },
      { content: '팁: 새해 계획 말고 주간 계획으로 쪼개면 좀 나음!' },
      { content: '2월인데 벌써 포기ㅋㅋ 그래도 괜찮아 다시 시작하면 돼!', replies: [
        { content: 'ㅇㅇ ADHD는 리셋이 빠른 게 장점이라고 생각함ㅋㅋ' },
      ]},
    ],
  },
  {
    slug: 'free',
    title: 'ADHD인데 연애하기 진짜 힘들다...',
    content: `연인이 ADHD를 이해 못하니까 자꾸 다투게 됨ㅠ

"왜 내 얘기 안 듣고 있어?" → 듣고 있는데 딴 생각이...
"왜 기념일 까먹어?" → 진심으로 미안한데 기억이...
"왜 약속 시간 맨날 늦어?" → 시간 개념이...

사랑하는 마음은 진짜인데
표현이 잘 안 되는 것 같아서 속상해요

ADHD인 분들 연애 어떻게 하고 계세요?`,
    popularity: 'normal',
    daysAgo: 6,
    comments: [
      { content: '저도 이거 때문에 진짜 많이 싸웠어요... 결국 ADHD 설명해주니까 좀 나아졌어요' },
      { content: '캘린더 공유하고 기념일 알림 설정하는 거 추천! 기술로 커버 가능해요' },
      { content: '상대방이 이해하려고 노력해주는 사람이면 괜찮아져요 힘내세요ㅠ', replies: [
        { content: '맞아요 이해하는 파트너를 만나는 게 중요한 듯' },
      ]},
    ],
  },
  {
    slug: 'free',
    title: '이 커뮤니티 생겨서 진짜 좋다',
    content: `ADHD 커뮤니티가 생겨서 진짜 기쁘다

주변에 ADHD인 사람이 없으니까
이해받지 못하는 느낌이 항상 있었거든요

여기 오면 다들 공감해주고
같은 경험을 나눌 수 있으니까
혼자가 아니라는 느낌이 들어요

운영해주셔서 감사합니다!
다들 화이팅!`,
    popularity: 'new',
    daysAgo: 0,
    comments: [
      { content: '맞아요! 여기서 위안 많이 받고 있어요ㅎㅎ' },
      { content: '혼자가 아니라는 게 가장 큰 힘이 되는 것 같아요' },
      { content: '다같이 화이팅이에요!!' },
    ],
  },

  // ═══════════════════════════════════════
  // ADHD 정보 (info) - 8글
  // ═══════════════════════════════════════
  {
    slug: 'info',
    title: '성인 ADHD 진단 과정 총정리',
    content: `성인 ADHD 진단 과정이 궁금하신 분들을 위해 정리했습니다.

■ 진단 과정
1. 정신건강의학과 초진 예약 (대학병원 또는 전문 클리닉)
2. 초진 상담 (30분~1시간): 현재 증상, 어린 시절 행동, 가족력
3. 심리검사 (종합): TOVA, CPT, 지능검사, 성격검사 등
4. 검사 결과 상담: 진단 여부 확인
5. 치료 계획 수립: 약물, 상담, 코칭 등

■ 비용
- 초진 상담: 5만~10만원 (보험 적용 시 2만원대)
- 심리검사: 30만~80만원 (검사 종류에 따라)
- 검사 후 상담: 3만~5만원

■ 소요 기간
- 전체 과정: 2~4주
- 대학병원은 예약 대기가 1~3개월 걸릴 수 있음

■ 팁
- 어린 시절 성적표, 생활기록부 가져가면 도움
- 부모님 동반하면 어린 시절 정보 파악에 좋음
- 초진 전에 증상 메모해 가기

궁금한 점 있으면 댓글로 질문해주세요!`,
    popularity: 'hot',
    daysAgo: 20,
    comments: [
      { content: '좋은 정보 감사합니다! 심리검사 비용이 좀 부담이네요ㅠ' },
      { content: '저는 대학병원 예약 2개월 기다렸어요... 클리닉이 빠르긴 합니다' },
      { content: '성적표 가져가라는 팁 진짜 유용하네요! 저도 곧 가보려고요', replies: [
        { content: '네! 선생님이 어린 시절 패턴을 중요하게 보시더라고요' },
      ]},
    ],
  },
  {
    slug: 'info',
    title: '2024 ADHD 치료 가이드라인 업데이트',
    content: `2024년 한국 ADHD 치료 가이드라인 주요 변경사항 공유합니다.

■ 주요 변경점
- 성인 ADHD 약물 치료 1차 권고약물 확대
- 메틸페니데이트(콘서타 등) + 아토목세틴(스트라테라) 병용 가이드 추가
- 비약물 치료(CBT, 코칭)의 근거 수준 상향
- 운동 처방의 보조 치료 인정

■ 약물 치료 권고
1차: 메틸페니데이트 서방형 (콘서타, 메디키넷)
2차: 아토목세틴 (스트라테라)
3차: 클로니딘, 부프로피온 등

■ 비약물 치료
- CBT (인지행동치료): 근거 수준 A
- ADHD 코칭: 근거 수준 B
- 운동: 주 3회 이상, 30분 유산소 권고

출처: 대한소아청소년정신의학회`,
    popularity: 'normal',
    daysAgo: 18,
    comments: [
      { content: '운동이 공식적으로 인정되다니! 저도 운동하니까 확실히 달라요' },
      { content: 'CBT 근거 수준이 A로 올라갔군요. 참고하겠습니다' },
    ],
  },
  {
    slug: 'info',
    title: 'ADHD와 불안장애 공존 비율이 50%래...',
    content: `ADHD 관련 논문 읽다가 놀라운 사실 발견

성인 ADHD 환자의 약 50%가 불안장애를 동반한다고 합니다.
그리고 우울증 동반 비율도 30~40%라고...

■ 주요 공존 질환 비율
- 불안장애: 47-53%
- 우울증: 30-40%
- 수면장애: 50-70%
- 물질사용장애: 15-25%

"그냥 불안한 성격"이라고 생각했는데
혹시 ADHD와 관련 있는 건 아닌지 체크해보세요.

진료 시 공존 질환도 함께 말씀하시면
치료 계획에 큰 도움이 됩니다.`,
    popularity: 'normal',
    daysAgo: 14,
    comments: [
      { content: '저 ADHD + 불안장애 둘 다 있어요... 치료가 복잡해지긴 하지만 약 잘 먹으니 나아졌어요' },
      { content: '수면장애 50~70% 진짜 체감됨... 잠들기가 너무 힘들어요' },
      { content: '유용한 정보 감사합니다!' },
    ],
  },
  {
    slug: 'info',
    title: '서울/경기 ADHD 전문 병원 리스트',
    content: `제가 다녀보거나 평판 좋은 곳 위주로 정리했어요.

■ 서울
- 서울대병원 소아청소년정신건강의학과 (성인도 가능)
- 삼성서울병원 정신건강의학과
- 연세세브란스 정신건강의학과
- 은평 ADHD 클리닉
- 강남 마음숲 정신건강의학과

■ 경기
- 분당서울대병원
- 아주대병원
- 일산백병원

■ 참고사항
- 대학병원은 검사가 체계적이지만 예약 대기 김
- 클리닉은 빠르게 진행 가능
- 네이버 예약 or 전화 예약

※ 개인 경험 기반이라 참고만 해주세요!
다른 좋은 곳 있으면 댓글로 추가해주세요~`,
    popularity: 'normal',
    daysAgo: 22,
    comments: [
      { content: '은평 클리닉 가봤는데 선생님 진짜 친절하셨어요 추천!' },
      { content: '경기 남부 쪽으로는 수원 아주대병원 추천합니다' },
      { content: '감사해요! 어디 가야 할지 몰랐는데 도움 많이 됐어요' },
    ],
  },
  {
    slug: 'info',
    title: 'ADHD와 수면 문제 - 왜 밤에 더 활발해질까?',
    content: `ADHD인 분들 밤에 오히려 정신이 맑아지는 경험 있죠?

■ 원인
1. 도파민 리듬 차이: ADHD는 저녁에 도파민 분비가 상대적으로 높음
2. 환경적 자극 감소: 밤에는 방해 요소가 적어서 집중이 잘 됨
3. 일주기 리듬 지연: ADHD는 생체시계가 2~3시간 뒤로 밀려있는 경우 많음
4. 과각성 상태: 뇌가 쉽게 이완되지 않아 잠들기 어려움

■ 대처법
- 저녁 운동 (잠들기 3시간 전 완료)
- 블루라이트 차단 (9시 이후)
- 일정한 기상 시간 유지 (취침보다 기상 시간이 더 중요!)
- 멜라토닌 보조제 (의사 상담 후)
- 수면 루틴 만들기 (샤워 → 스트레칭 → 독서)`,
    popularity: 'normal',
    daysAgo: 11,
    comments: [
      { content: '밤에 더 활발한 이유가 있었구나ㅋㅋ 신기하다' },
      { content: '기상 시간이 취침보다 중요하다는 건 처음 알았어요!' },
      { content: '멜라토닌 먹어보신 분 효과 있었나요?', replies: [
        { content: '저는 3mg 먹고 있는데 잠드는 시간이 좀 빨라졌어요' },
      ]},
    ],
  },
  {
    slug: 'info',
    title: '운동이 ADHD에 미치는 영향 (논문 기반)',
    content: `운동이 ADHD 증상 완화에 도움이 된다는 연구 결과 정리

■ 주요 연구 결과
- 유산소 운동 20분 후 집중력 향상 효과 30분~2시간 지속
- 주 3회 이상 규칙적 운동 시 약물 효과 보조
- 운동 후 도파민, 노르에피네프린 분비 증가

■ 추천 운동
1. 달리기/조깅: 가장 많이 연구된 유산소 운동
2. 수영: 전신 운동 + 감각 자극
3. 격투기/복싱: 집중력 + 에너지 발산
4. 클라이밍: 순간 집중력 필요
5. 요가: 마음 챙김 + 신체 인식

■ 팁
- 좋아하는 운동을 찾는 게 가장 중요!
- 아침 운동이 하루 집중력에 가장 효과적
- 운동 루틴은 작게 시작 (10분 산책부터)`,
    popularity: 'normal',
    daysAgo: 16,
    comments: [
      { content: '클라이밍 시작했는데 진짜 집중 잘 돼요! 추천합니다' },
      { content: '아침 운동 효과 ㄹㅇ... 약 먹기 전에 30분 뛰면 하루가 달라짐' },
    ],
  },
  {
    slug: 'info',
    title: 'ADHD 성인도 장애인 등록 가능한가요?',
    content: `ADHD로 장애인 등록이 가능한지 궁금해서 알아봤습니다.

■ 현재 상황 (2024년 기준)
- ADHD 단독으로는 장애인 등록 불가
- 다만, ADHD + 우울증/불안장애 등으로 "정신장애"에 해당할 수 있음
- 일상생활 기능 저하가 심한 경우 가능성 있음

■ 등록 과정
1. 6개월 이상 동일 병원에서 치료 기록 필요
2. 장애진단서 발급 (전문의)
3. 국민연금공단 심사
4. 심사 통과 시 등록

■ 대안적 지원
- 정신건강복지센터: 무료 상담, 프로그램
- 근로 지원: 중증이면 직업재활 서비스
- 의료비 지원: 저소득층 대상

자세한 건 거주지 정신건강복지센터에 문의해보세요.`,
    popularity: 'new',
    daysAgo: 3,
    comments: [
      { content: '정보 감사합니다. ADHD 단독으로 안 되는 건 좀 아쉽네요...' },
      { content: '정신건강복지센터 무료 상담 좋은 정보네요! 찾아봐야겠다' },
    ],
  },
  {
    slug: 'info',
    title: 'ADHD 관련 추천 유튜브 채널 모음',
    content: `ADHD 이해하는 데 도움 되는 유튜브 채널 추천합니다!

■ 한국어 채널
- 뇌부자들: ADHD 포함 뇌과학 콘텐츠
- 정신과 전문의 김: 의학적 관점의 ADHD 설명
- 마음의 숲: 정신건강 전반

■ 영어 채널 (자막 있음)
- How to ADHD: ADHD 전문 채널 (가장 유명)
- Dr. Russell Barkley: ADHD 연구 권위자 강의
- TotallyADD: ADHD 성인 대상

■ 팟캐스트
- ADHD reWired
- Hacking Your ADHD

콘텐츠로 배우는 게 ADHD에게는 효과적이더라구요ㅋㅋ
(과집중으로 10개씩 연속 시청 주의ㅋㅋ)`,
    popularity: 'new',
    daysAgo: 1,
    comments: [
      { content: 'How to ADHD 진짜 좋아요! Jessica 너무 친근함ㅋㅋ' },
      { content: '뇌부자들 아직 안 본 사람은 꼭 보세요 재밌어요' },
      { content: '과집중으로 10개 연속 시청 주의ㅋㅋㅋ 완전 공감' },
    ],
  },

  // ═══════════════════════════════════════
  // 일상 공유 (daily) - 10글
  // ═══════════════════════════════════════
  {
    slug: 'daily',
    title: '오늘 타이머 세팅하고 공부했더니 대박ㅋㅋ',
    content: `포모도로 테크닉 처음 써봤는데

25분 집중 + 5분 휴식

솔직히 처음엔 "이게 되겠어?" 했는데
타이머가 째깍째깍 하니까 뇌가 긴장하는 느낌?

보통 1시간 앉아도 30분은 멍때리거든
근데 오늘 포모도로 4세트 하니까
실제 집중 시간이 진짜 1시간 30분은 된 듯!

ADHD한테는 시간 시각화가 핵심인 것 같아
추천 앱: Forest, Focus To-Do`,
    popularity: 'hot',
    daysAgo: 2,
    comments: [
      { content: '포모도로 진짜 좋죠! 근데 25분 긴 사람은 15분으로 시작해도 됨' },
      { content: 'Forest 앱 쓰고 있는데 나무 키우는 재미에 집중력이 올라감ㅋㅋ' },
      { content: '저도 해봐야겠다! 다운받았어요', replies: [
        { content: '화이팅! 처음엔 2세트만 해도 성공이에요' },
      ]},
      { content: '타이머 종류 중에 시각적으로 시간이 줄어드는 거 추천. Time Timer라고' },
    ],
  },
  {
    slug: 'daily',
    title: 'ADHD인의 냉장고 상태.jpg',
    content: `냉장고 정리하다가 발견한 것들...

- 유통기한 2개월 지난 우유 (왜 안 버렸지?)
- 같은 소스가 3개 (있는 줄 모르고 또 삼)
- 반만 먹다 만 과일 (까먹고 방치)
- 뭔지 모를 반찬통 (열어보기 무서움)
- 배달 시킬 때 같이 온 소스 (모으면 한 서랍)

ADHD 냉장고 = 고고학 발굴 현장ㅋㅋㅋ

다들 냉장고 상태 어때?ㅋㅋ`,
    popularity: 'normal',
    daysAgo: 5,
    comments: [
      { content: '같은 소스 3개ㅋㅋㅋㅋ 이거 너무 공감... 나는 간장이 4개 있었음' },
      { content: '냉장고 정리 주기를 캘린더에 등록해놨어요ㅋㅋ 안 그러면 영원히 안 함' },
      { content: '고고학 발굴 현장ㅋㅋㅋㅋㅋ 네이밍 천재' },
    ],
  },
  {
    slug: 'daily',
    title: '카페에서만 집중 되는 사람 나만 있어?',
    content: `집에서는 진짜 하나도 안 되는데
카페만 가면 갑자기 생산성이 올라감ㅋㅋ

이유를 분석해봤는데:
1. 적당한 소음이 백색소음 역할
2. 다른 사람이 보고 있다는 긴장감
3. 커피 = 카페인 = 도파민 부스터
4. 물리적 공간 변화가 뇌를 리셋

그래서 요즘은 "집중 필요한 일 = 카페행" 공식 적용 중

카페 말고 집중 잘 되는 장소 있으면 공유해주세요!`,
    popularity: 'normal',
    daysAgo: 8,
    comments: [
      { content: '나도 카페 아니면 도서관에서만 집중돼요! 집은 유혹이 너무 많아...' },
      { content: '사람 적은 스터디카페도 추천! 타이머도 있고' },
      { content: '나는 차 안에서 집중 잘 되던데ㅋㅋ 적당히 좁은 공간이 좋음', replies: [
        { content: '오 차에서! 색다르다ㅋㅋ 나도 해봐야겠다' },
      ]},
    ],
  },
  {
    slug: 'daily',
    title: '아침 루틴 만들어봤는데 3일째 성공 중!',
    content: `ADHD한테 루틴은 진짜 어렵잖아요
근데 이번엔 진짜 작게 시작했어요

내 아침 루틴:
1. 알람 끄면 바로 이불 개기 (30초)
2. 물 한 잔 마시기 (10초)
3. 세수하기 (2분)
4. 5분 스트레칭 (유튜브 틀어놓기)

이게 다야ㅋㅋ

근데 이것만 해도 "오늘 뭔가 했다" 느낌이 들어서 기분 좋음

3일째라 아직 모르겠지만
일단은 성공 중이라 뿌듯해요!`,
    popularity: 'normal',
    daysAgo: 1,
    comments: [
      { content: '3일 성공 대단해요! 작게 시작하는 게 핵심이죠. 응원합니다!' },
      { content: '이불 개기부터 시작하는 거 좋다ㅋㅋ 나도 따라해볼게요' },
      { content: '저는 7일 가다가 망했는데ㅠ 다시 시작해야지...', replies: [
        { content: '망해도 다시 시작하면 되는 거예요! ADHD는 리셋이 특기잖아요ㅋㅋ' },
      ]},
    ],
  },
  {
    slug: 'daily',
    title: '택배 5개 째 안 뜯고 쌓여있는 중ㅋㅋ',
    content: `주문할 때: 빨리 와라!! 설렘 MAX!!
택배 도착: 아 왔구나 (관심 급감)
3일 후: 택배가 쌓여있는 걸 발견

현재 상태:
📦📦📦📦📦 ← 내 방 한쪽

주문한 건 기억나는데 뜯는 건 까먹어ㅋㅋ
도파민이 "주문"에서 끝나버린 것 같음

다들 택배 바로 뜯어?ㅋㅋ`,
    popularity: 'normal',
    daysAgo: 3,
    comments: [
      { content: '나 5개 아니고 10개 쌓여있어ㅋㅋㅋ 좀 뜯어야 하는데...' },
      { content: '도파민이 주문에서 끝나버린 거ㅋㅋㅋ 완벽한 분석' },
      { content: '팁: 도착하면 현관에서 바로 뜯어! 방에 들고 가면 끝임ㅋㅋ' },
    ],
  },
  {
    slug: 'daily',
    title: 'ADHD인의 가방 속 필수템',
    content: `ADHD 서바이벌 키트 공유합니다ㅋㅋ

필수 중의 필수:
- 보조배터리 (폰이 생명줄)
- 이어폰 (소음 차단 = 집중력)
- 작은 수첩 + 펜 (디지털 메모 앱 열기 전에 까먹으니까)
- 약통 (약 먹었는지 확인용 요일별 약통)
- 물병 (약 먹을 때 + 수분 섭취)
- 여분의 충전기 (까먹고 안 가져올 때 대비)

추가 아이템:
- 타이머 앱 위젯 (폰 홈화면에)
- 에어태그 (물건 잃어버릴 때)

다들 가방에 뭐 필수로 넣고 다녀?`,
    popularity: 'normal',
    daysAgo: 9,
    comments: [
      { content: '요일별 약통 ㄹㅇ 필수... 안 그러면 "오늘 먹었나?" 매일 고민함' },
      { content: '에어태그 진짜 인생템이에요! 지갑 찾는 횟수가 0이 됨ㅋㅋ' },
      { content: '저는 꼭 간식 넣어다녀요ㅋㅋ 배고프면 집중 0됨', replies: [
        { content: '아 맞아 간식 중요! 혈당 떨어지면 뇌 멈춤ㅋㅋ' },
      ]},
    ],
  },
  {
    slug: 'daily',
    title: '오늘 병원 예약 잡았다! 3개월 만에!',
    content: `3개월 전부터 "병원 가야지" 하면서 미루다가
오늘 드디어 예약 잡았어요!!!

미루고 있던 이유:
1. 전화하기 귀찮아서 (전화 공포증)
2. 시간 맞추기 어려워서
3. "다음 주에 하자" 무한반복

결국 오늘 네이버 예약으로 클릭 3번에 끝냄ㅋㅋ
전화 안 해도 되니까 너무 좋다

아직 병원 예약 미루고 있는 분들!
지금 당장 네이버 예약 고고!`,
    popularity: 'new',
    daysAgo: 0,
    comments: [
      { content: '축하해요!! 예약 잡는 것 자체가 대단한 거예요!' },
      { content: '네이버 예약 ㄹㅇ 혁명... 전화 없이 되니까 미루는 거 줄었음' },
      { content: '나도 3개월째 미루고 있는데ㅋㅋ 이 글 보고 방금 예약했다!', replies: [
        { content: '오 대박! 같이 화이팅해요!!' },
      ]},
    ],
  },
  {
    slug: 'daily',
    title: '할일 목록 앱 추천해주세요ㅠ',
    content: `지금까지 써본 앱:
- 기본 미리알림: 알림 꺼버림ㅋㅋ
- 투두이스트: 뭔가 복잡해서 포기
- 노션: 세팅하다가 3시간 날리고 실제 할일은 안 함ㅋㅋ
- 포스트잇: 붙여놓고 안 봄

ADHD한테 맞는 심플한 할일 앱 없을까요?

조건:
- 최대한 심플할 것
- 알림이 강력할 것
- 뭔가 보상 요소가 있으면 좋겠음 (게이미피케이션)`,
    popularity: 'normal',
    daysAgo: 6,
    comments: [
      { content: 'Habitica 추천! 게임처럼 할일 관리하는 앱이에요. 캐릭터 키우는 재미 있음', replies: [
        { content: '오 이거 좋아보인다! 다운받아볼게요' },
      ]},
      { content: 'TickTick 추천합니다. 포모도로 타이머도 내장되어있고 심플해요' },
      { content: '구글 킵이 제일 심플하고 좋았어요. 위젯으로 항상 보이게 해두면 됨' },
      { content: '노션 세팅하다 3시간ㅋㅋㅋ 이거 나야 나' },
    ],
  },
  {
    slug: 'daily',
    title: '산책이 진짜 효과 있더라',
    content: `약물 치료 받으면서 산책도 시작했는데

아침에 20분만 걸어도 그날 하루가 다름
뇌가 깨어나는 느낌?

효과:
- 약 효과 시작 전 부족한 집중력 보충
- 기분 전환 (우울한 날 특히 좋음)
- 수면의 질 향상
- 과한 에너지 발산

처음엔 "산책이 뭐..." 했는데
2주 하니까 안 한 날이 차이가 느껴짐

특별한 거 아니어도 동네 한 바퀴만 돌아보세요!`,
    popularity: 'normal',
    daysAgo: 7,
    comments: [
      { content: '나도 산책 시작했는데 진짜 달라요! 약과 병행하면 시너지 개쩜' },
      { content: '비오는 날도 걸어?ㅋㅋ 비올 때 대안이 있으면 좋겠다', replies: [
        { content: '비올 때는 실내 자전거 타거나 유튜브 댄스영상 따라해요ㅋㅋ' },
      ]},
      { content: '안 한 날 차이가 느껴진다 이거 공감... 안 걸은 날은 뭔가 뇌가 무거움' },
    ],
  },
  {
    slug: 'daily',
    title: 'ADHD인의 노트 필기 방법',
    content: `학교 다닐 때부터 필기가 안 됐는데
나한테 맞는 방법 찾음ㅋㅋ

❌ 안 맞는 방법:
- 줄글 필기: 앞에 뭐 적었는지 까먹음
- 깔끔한 노트: 꾸미다가 내용 놓침

✅ 맞는 방법:
- 마인드맵: 키워드 중심으로 연결
- 불릿 저널: 짧은 문장, 기호 사용
- 코넬 노트: 핵심 + 요약 분리
- 녹음 + 키워드 메모: 일단 녹음하고 키워드만 적기

핵심은 "완벽하게 적으려 하지 말기"
키워드만 적어도 충분해요!

다들 어떻게 필기해?`,
    popularity: 'new',
    daysAgo: 4,
    comments: [
      { content: '마인드맵 진짜 좋아요! 아이패드 + GoodNotes 조합이 최고' },
      { content: '녹음 + 키워드가 나한테 제일 맞았어. 나중에 들으면서 보충하면 됨' },
      { content: '꾸미다가 내용 놓치는 거ㅋㅋㅋ 학교 때 내 모습...' },
    ],
  },

  // ═══════════════════════════════════════
  // 약물/치료 후기 (treatment) - 8글
  // ═══════════════════════════════════════
  {
    slug: 'treatment',
    title: '콘서타 27mg 1개월 복용 후기',
    content: `콘서타 27mg 복용 1개월 차 후기 공유합니다.

■ 기본 정보
- 진단: 성인 ADHD 복합형
- 약물: 콘서타 27mg (아침 식후)
- 복용 기간: 1개월

■ 효과
- 복용 30분~1시간 후 집중력 확 올라감
- "해야 하는 일"을 시작하는 게 쉬워짐
- 머릿속이 조용해짐 (원래 항상 생각이 여러 개 동시에 돌아갔는데)
- 지속 시간: 약 8~10시간

■ 부작용
- 첫 2주: 식욕 감소 (점심 거의 못 먹음)
- 입 마름 (물 많이 마시면 괜찮음)
- 저녁에 약 빠지면서 리바운드 (좀 우울해짐)
- 수면에는 크게 영향 없었음

■ 총평
인생이 달라졌다는 표현이 과장이 아님
처음으로 "집중"이 뭔지 알았어요
부작용은 시간이 지나면서 좀 나아지는 중

궁금한 점 있으면 댓글로 물어봐주세요!`,
    popularity: 'hot',
    daysAgo: 8,
    comments: [
      { content: '머릿속이 조용해진다는 거 ㄹㅇ 공감... 처음 약 먹고 울었어요ㅠ', replies: [
        { content: '맞아요 "이게 정상인 사람의 뇌구나" 하는 느낌...' },
      ]},
      { content: '식욕 감소는 저도 있었는데 3주차부터 좀 나아졌어요!' },
      { content: '리바운드 우울감 어떻게 대처하세요? 저도 그게 고민이에요', replies: [
        { content: '저는 약 빠지는 시간에 맞춰서 가벼운 운동해요. 좀 도움 됨' },
      ]},
      { content: '좋은 후기 감사합니다! 저도 다음 주 진료인데 참고할게요' },
    ],
  },
  {
    slug: 'treatment',
    title: '스트라테라 vs 콘서타 비교 경험',
    content: `두 약 다 먹어본 사람으로서 비교해볼게요.

■ 콘서타 (메틸페니데이트)
- 효과 발현: 30분~1시간 (빠름)
- 지속 시간: 8~12시간
- 장점: 즉각적인 효과, 집중력↑
- 단점: 식욕 감소, 리바운드, 남용 가능성
- 체감: ON/OFF 스위치 느낌

■ 스트라테라 (아토목세틴)
- 효과 발현: 2~6주 (느림)
- 지속 시간: 24시간 (하루 종일)
- 장점: 24시간 효과, 리바운드 없음, 비향정
- 단점: 효과 체감 약함, 초기 메스꺼움
- 체감: 자연스럽게 좀 나아진 느낌

■ 개인적 결론
저는 콘서타가 맞았어요
직업 특성상 낮에 집중이 확실히 필요해서

근데 사람마다 다르니까 의사 선생님과 상의하세요!`,
    popularity: 'normal',
    daysAgo: 12,
    comments: [
      { content: '저는 반대로 스트라테라가 맞았어요! 콘서타 리바운드가 너무 심해서ㅠ' },
      { content: '두 약 비교해주셔서 감사해요. 곧 상담인데 참고할게요' },
      { content: '콘서타 ON/OFF 느낌 ㄹㅇ... 약 빠지면 확 느껴짐' },
      { content: '혹시 두 약 병용해보신 분 있나요?', replies: [
        { content: '가이드라인상 병용 가능하대요. 의사 선생님께 물어보세요' },
      ]},
    ],
  },
  {
    slug: 'treatment',
    title: 'CBT 인지행동치료 받아본 사람?',
    content: `약물 치료만으로는 한계를 느껴서
CBT (인지행동치료) 시작했는데 궁금한 게 많아요

현재 3회 진행 중인데:
- 생각 패턴 인식하기
- 자동적 부정 사고 잡기
- 행동 계획 세우기

아직 초기라 효과를 잘 모르겠어서...

CBT 받아본 분들:
1. 얼마나 오래 받으셨어요?
2. 효과 느끼기까지 시간이 얼마나 걸렸나요?
3. 약물 + CBT 병행이 좋았나요?
4. 비용은 어떻게 되나요?

경험 공유해주시면 감사합니다!`,
    popularity: 'normal',
    daysAgo: 6,
    comments: [
      { content: '6개월 받았는데 약 + CBT 조합이 최고였어요! 8주차부터 효과 체감', replies: [
        { content: '8주차요? 좀 오래 걸리긴 하는군요... 인내심을 가져야겠네요' },
      ]},
      { content: '비용이 회당 10~15만원 정도인데 좀 부담스럽긴 해요ㅠ' },
      { content: '저는 약만 먹다가 CBT 추가했는데 생활 관리 능력이 확 올라갔어요' },
    ],
  },
  {
    slug: 'treatment',
    title: '약 먹고 처음으로 책 한 권 다 읽었다ㅠ',
    content: `진짜 울면서 쓰는 글이에요ㅠㅠ

어릴 때부터 책을 한 번도 끝까지 읽은 적이 없었어요
항상 처음 몇 페이지 읽다가 딴 거 함
"난 독서를 못하는 사람인가보다" 라고 생각했죠

근데 약 먹고 2주째 되던 날
카페에서 책 펴놓고 읽기 시작했는데

2시간 후에... 끝까지 읽었어요

살면서 처음으로 책 한 권을 다 읽었어요
30년 만에ㅠㅠ

약이 만능은 아니지만
이런 경험이 자존감을 올려주는 것 같아요`,
    popularity: 'hot',
    daysAgo: 4,
    comments: [
      { content: '축하해요ㅠㅠ 저도 약 먹고 처음 책 다 읽었을 때 울었어요', replies: [
        { content: '우리 모두 고생했어요ㅠ 앞으로 더 좋아질 거예요' },
      ]},
      { content: '이 글 보고 울컥했다... 진짜 공감이에요' },
      { content: '와 30년 만에라니... 정말 대단하세요. 진심으로 축하드려요!' },
      { content: '자존감 올라가는 거 맞아요. 작은 성공 경험이 쌓이면 인생이 달라져요' },
      { content: '혹시 무슨 책 읽으셨어요?ㅋㅋ 궁금', replies: [
        { content: '"아몬드"요! 얇은 책으로 시작했어요ㅋㅋ' },
      ]},
    ],
  },
  {
    slug: 'treatment',
    title: '메틸페니데이트 부작용 경험 공유',
    content: `메틸페니데이트(콘서타/메디키넷) 부작용 경험 공유합니다.
다른 분들 참고하시라고 적어봐요.

■ 초기 (1~2주)
- 식욕 감소: 점심 거의 못 먹을 정도. 3주차부터 좀 나아짐
- 입 마름: 물병 필수
- 두통: 첫 3일 정도
- 가슴 두근거림: 약간 있었지만 1주일 후 사라짐

■ 지속 (1개월+)
- 식욕 감소: 좀 나아졌지만 여전히 있음
- 리바운드: 약 빠지는 저녁에 기분 저하
- 체중 감소: 1개월에 2kg 빠짐

■ 대처법
- 아침에 든든히 먹기 (약 먹기 전에!)
- 점심은 작은 양이라도 먹기
- 저녁에 리바운드 올 때 가벼운 운동
- 충분한 수분 섭취

※ 부작용은 개인차가 크니까 반드시 의사와 상담하세요!`,
    popularity: 'normal',
    daysAgo: 10,
    comments: [
      { content: '대처법 감사해요! 아침에 든든히 먹는 게 진짜 중요한 듯' },
      { content: '저는 식욕 감소가 너무 심해서 용량 줄였어요. 의사 선생님과 상의하세요!' },
      { content: '리바운드 이거 저도 있는데... 운동 팁 해봐야겠다' },
    ],
  },
  {
    slug: 'treatment',
    title: '약 안 먹는 날 차이가 너무 확실해...',
    content: `평일은 콘서타 먹고 주말은 쉬는데
(drug holiday라고 하더라구요)

약 먹는 날:
- 해야 할 일 목록 순서대로 처리
- 대화 집중 가능
- 머릿속이 조용함
- 시간 관리 가능

약 안 먹는 날:
- 유튜브로 시작해서 유튜브로 끝남
- 대화 중 딴 생각 10번
- 머릿속이 시끄러움
- 시간이 어디 갔는지 모름

차이가 너무 확실해서
"아 나 진짜 ADHD구나" 실감함...

여러분도 drug holiday 하시나요?`,
    popularity: 'normal',
    daysAgo: 5,
    comments: [
      { content: '저도 주말 쉬는데 차이 너무 큼ㅋㅋ 근데 쉬는 날도 필요하대요' },
      { content: '저는 매일 먹어요. 선생님이 꾸준히 먹는 게 낫다고 하셔서' },
      { content: '차이 느끼면 오히려 약의 소중함을 알게 되더라ㅋㅋ', replies: [
        { content: '맞아요ㅋㅋ 안 먹는 날에 "아 오늘 약 안 먹었지" 실감' },
      ]},
    ],
  },
  {
    slug: 'treatment',
    title: '정신건강의학과 첫 방문 후기',
    content: `오늘 드디어 첫 진료 다녀왔어요...!

■ 걱정했던 것
- "미친 사람 취급하면 어쩌지?"
- "별거 아닌 걸로 왔다고 하면?"
- "무섭지 않을까?"

■ 실제로
- 선생님이 진짜 친절하셨음
- 증상 하나하나 자세히 들어주심
- "힘드셨겠네요"라는 말에 울뻔
- 심리검사 일정 잡고 나옴

■ 느낀 점
- 일찍 올 걸... 1년 넘게 미뤘는데
- 정신과 = 무서운 곳이 아님
- 선생님이 이해해주시는 것만으로도 힘이 됨

아직 망설이고 계신 분들!
정신과 진짜 안 무서워요. 그냥 가세요!`,
    popularity: 'normal',
    daysAgo: 2,
    comments: [
      { content: '첫 방문 축하드려요!! 저도 첫날 울 뻔했어요ㅋㅋ 이해받는 느낌이 너무 좋았음' },
      { content: '1년 미룬 것도 공감... 근데 진짜 가면 "왜 안 왔지?" 하게 됨ㅋㅋ' },
      { content: '좋은 선생님 만나셔서 다행이에요! 앞으로의 치료도 잘 되시길!', replies: [
        { content: '감사합니다! 심리검사 끝나면 후기도 올릴게요' },
      ]},
    ],
  },
  {
    slug: 'treatment',
    title: '약값이 너무 비싸요... 할인 방법?',
    content: `콘서타 27mg 한 달 약값이 거의 10만원 가까이 나와요ㅠ
(보험 적용 후에도)

매달 이 비용이 부담스러운데
혹시 약값 아끼는 방법 아시는 분?

알아본 것:
1. 본인부담상한제: 연간 의료비가 일정 금액 넘으면 환급
2. 제네릭 약 변경: 콘서타 대신 제네릭으로 (효과 차이?)
3. 장기처방: 3개월 처방받으면 진료비라도 줄이기

다른 방법 있으면 공유해주세요!`,
    popularity: 'new',
    daysAgo: 1,
    comments: [
      { content: '메디키넷이 콘서타 제네릭인데 좀 더 싸요! 효과는 비슷한데 지속시간이 좀 짧음' },
      { content: '본인부담상한제 진짜 유용해요. 연말에 환급 받았어요' },
      { content: '저소득층이시면 정신건강복지센터에 문의해보세요. 의료비 지원 프로그램이 있어요' },
      { content: '처방전 가지고 약국 돌아다녀봤는데 약국마다 가격 좀 달라요. 비교해보세요' },
    ],
  },

  // ═══════════════════════════════════════
  // 부모 게시판 (parents) - 7글
  // ═══════════════════════════════════════
  {
    slug: 'parents',
    title: '초등학생 아들이 ADHD 진단 받았어요',
    content: `초등 2학년 아들이 어제 ADHD 진단을 받았습니다.

선생님께서 "수업 시간에 자꾸 돌아다닌다"고 하셔서
혹시나 해서 병원에 데려갔는데 진짜 ADHD래요...

솔직히 좀 충격이에요.
"우리 애가 왜?" 하는 마음도 있고
"일찍 알아서 다행이다" 하는 마음도 있고

앞으로 어떻게 해줘야 할지 너무 막막합니다.

같은 경험 있으신 부모님들 조언 부탁드려요ㅠ`,
    popularity: 'hot',
    daysAgo: 7,
    comments: [
      { content: '저도 아들이 초3때 진단 받았어요. 처음엔 충격이지만 일찍 아는 게 정말 좋은 거예요. 힘내세요!', replies: [
        { content: '감사합니다ㅠ 혹시 초기에 어떤 도움을 주셨어요?' },
        { content: '일단 아이에게 "네 잘못이 아니야"라고 말해주세요. 그리고 학교랑 소통이 중요해요' },
      ]},
      { content: '일찍 알아서 다행이에요. 성인이 돼서 진단받은 사람으로서 어렸을 때 알았으면 하는 마음이...' },
      { content: '약물 치료 고민되시겠지만 전문의와 상담하시면 좋은 방향 찾으실 거예요. 응원합니다!' },
      { content: '부모 교육 프로그램도 있어요! 정신건강복지센터에 문의해보세요' },
    ],
  },
  {
    slug: 'parents',
    title: '학교에서 자꾸 전화 오는 엄마의 하루',
    content: `오늘도 학교에서 전화가 왔어요...

"아이가 수업 시간에 친구를 방해해서요"
"급식 시간에 돌아다녀서요"
"체육 시간에 규칙을 안 지켜서요"

매번 전화 받을 때마다 미안하고 속상하고
아이한테 화를 낼 수도 없고

아이도 하고 싶어서 하는 게 아닌 건 아는데
학교에서는 이해를 못하는 것 같아요

같은 상황의 엄마 아빠들은
학교 전화 어떻게 대처하고 계세요?`,
    popularity: 'normal',
    daysAgo: 4,
    comments: [
      { content: '공감이에요ㅠ 저도 전화 올 때마다 심장이 쿵... 아이 잘못이 아닌데 죄책감이 들어요', replies: [
        { content: '맞아요. 우리도, 아이도 잘못한 게 아닌데 자꾸 미안해지죠ㅠ' },
      ]},
      { content: '담임선생님께 ADHD에 대해 자료와 함께 설명드려보세요. 이해하시면 많이 달라져요' },
      { content: '우리 학교는 특수교육 지원 신청했더니 보조교사가 와서 도움 됐어요!' },
      { content: '힘내세요ㅠ 혼자가 아니에요' },
    ],
  },
  {
    slug: 'parents',
    title: 'ADHD 아이 학습 도와주는 방법 공유',
    content: `ADHD 아들 4학년인데 시행착오 끝에 찾은 방법 공유해요.

■ 효과 있었던 것
1. 짧은 시간 + 자주 쉬기: 20분 공부 + 10분 휴식
2. 시각적 타이머 사용: Time Timer 앱 추천
3. 칭찬 스티커 보드: 작은 목표 달성할 때마다 스티커
4. 교과서 말고 영상 자료: EBS 같은 교육 영상 활용
5. 오답 관리보다 "맞은 것" 위주 칭찬
6. 과목 순서: 좋아하는 과목 → 싫어하는 과목 → 좋아하는 과목

■ 효과 없었던 것
- "집중해!" 반복하기 (역효과)
- 긴 시간 앉아있기 강요
- 남들과 비교하기

핵심은 "작은 성공 경험"을 쌓아주는 거예요.
처음엔 5분만 집중해도 칭찬해주세요!`,
    popularity: 'hot',
    daysAgo: 14,
    comments: [
      { content: '칭찬 스티커 보드 진짜 효과 좋아요! 우리 아이도 스티커 모으는 재미에 공부해요ㅋㅋ' },
      { content: '"집중해!" 반복이 역효과... 이거 뜨끔ㅠ 반성합니다' },
      { content: '좋은 정보 감사합니다! 20분 + 10분 오늘부터 해볼게요', replies: [
        { content: '처음엔 15분 + 10분으로 시작하셔도 돼요! 점진적으로 늘려가세요' },
      ]},
      { content: 'EBS 영상 진짜 좋아요. 우리 아이는 영상으로 보면 집중 잘 함' },
    ],
  },
  {
    slug: 'parents',
    title: '담임선생님께 ADHD 설명하기',
    content: `새 학년이라 담임선생님이 바뀌어서
또 ADHD 설명을 해야 했어요

매년 하는 일이지만 항상 긴장되네요...

이번에 준비한 것:
1. ADHD 간단 설명 자료 (A4 한 장)
2. 아이의 특성과 대처법 메모
3. 약물 복용 정보
4. 긴급 연락처

선생님이 이해해주시면 정말 큰 도움이 되는데
이해를 안 해주시면... 한 해가 너무 힘들어져요

A4 한 장 자료는 "ADHD 이해하기" 같은 곳에서
부모용 가이드를 참고해서 만들었어요

다른 분들은 어떻게 설명하세요?`,
    popularity: 'normal',
    daysAgo: 10,
    comments: [
      { content: 'A4 한 장 정리하는 거 좋은 방법이네요! 저도 해볼게요. 혹시 양식 공유 가능하신가요?' },
      { content: '저는 진료 기록지를 가져갔어요. 공식 자료가 있으면 선생님도 더 진지하게 받아들이시더라고요' },
      { content: '올해 담임은 ADHD를 이해해주셨으면 좋겠네요ㅠ 응원합니다!' },
    ],
  },
  {
    slug: 'parents',
    title: '약 먹이는 게 맞는 건지 고민...',
    content: `아이가 ADHD 진단을 받고 약물 치료를 권유받았어요.

"아이에게 정신과 약을 먹여도 될까?"
이 생각에 잠이 안 와요...

걱정되는 점:
- 성장기 아이에게 약물이 안전한가?
- 의존성이 생기진 않을까?
- 주변에서 "그 나이에 무슨 약?" 이런 시선
- 아이가 스스로 "나는 약 없인 안 되는 사람"이라 생각할까봐

전문의 선생님은 안전하다고 하시는데
부모 마음이라 쉽게 결정이 안 되네요...

약물 치료 결정하신 분들 어떤 과정으로 결정하셨나요?`,
    popularity: 'normal',
    daysAgo: 9,
    comments: [
      { content: '저도 6개월 고민했어요. 근데 아이가 약 먹고 "엄마 나 오늘 수업 다 들었어!" 했을 때 결정 잘했다 싶었어요ㅠ', replies: [
        { content: '그 말씀 듣고 울컥하네요ㅠ 감사합니다' },
      ]},
      { content: '안경 쓰는 것처럼 생각하면 돼요. 눈이 안 좋으면 안경 쓰잖아요. 뇌가 도움이 필요하면 약을 먹는 거예요' },
      { content: '의존성 걱정은... 전문의 선생님 말씀대로 관리하면 안전해요. 저도 처음엔 걱정했지만 괜찮았어요' },
      { content: '주변 시선은 무시하세요. 아이의 행복이 가장 중요해요.' },
      { content: '약 없이 행동 치료만으로도 가능한 경우가 있대요. 선생님과 자세히 상담해보세요!' },
    ],
  },
  {
    slug: 'parents',
    title: 'ADHD 아이 칭찬하는 방법',
    content: `상담사 선생님께 배운 ADHD 아이 칭찬법 공유합니다.

■ 좋은 칭찬
- "5분 동안 앉아서 잘 했네!" (구체적 행동)
- "스스로 숙제 시작한 거 대단해!" (과정 칭찬)
- "어제보다 집중 시간이 늘었구나!" (성장 칭찬)
- 즉시 칭찬하기 (나중에 하면 효과 ↓)

■ 안 좋은 칭찬
- "착하네" (모호함)
- "다른 애들은 다 하는데 너도 했네" (비교)
- "약 먹어서 잘했지?" (약에 공 돌리기)

■ 핵심
- 작은 것도 구체적으로 칭찬
- "결과"보다 "과정"을 칭찬
- 일관되게, 자주!

ADHD 아이들은 부정적 피드백을 더 많이 받기 때문에
칭찬의 빈도를 의식적으로 높여야 한대요.

저도 처음엔 어색했는데 하다 보니 자연스러워졌어요!`,
    popularity: 'normal',
    daysAgo: 13,
    comments: [
      { content: '이거 정말 도움 되는 글이에요. "약 먹어서 잘했지"는 무의식적으로 했는데 반성합니다ㅠ', replies: [
        { content: '저도 그랬어요ㅠ 아이의 노력을 인정해주는 게 중요하대요' },
      ]},
      { content: '구체적 칭찬 진짜 효과 좋아요! "정리정돈 잘했네" 하니까 아이가 뿌듯해하더라고요' },
      { content: '과정 칭찬 중요하다는 거 공감해요. 결과만 보면 아이가 금방 좌절하더라고요' },
    ],
  },
  {
    slug: 'parents',
    title: '같은 상황의 부모님들께 힘내라고...',
    content: `ADHD 아이를 키우는 건 정말 쉽지 않죠.

매일 전화 받고
매일 숙제 도와주고
매일 소리 지르고 후회하고
매일 "내가 잘하고 있나?" 고민하고

그래도 우리 아이들은 정말 특별한 아이들이에요.
에너지 넘치고, 창의적이고, 공감 능력 좋고.

오늘도 고생하신 부모님들께
"잘 하고 계세요" 라고 말씀드리고 싶어요.

혼자가 아니에요.
우리 같이 힘내요!

(가끔은 부모님도 쉬어야 해요. 자기 돌봄도 중요합니다!)`,
    popularity: 'normal',
    daysAgo: 3,
    comments: [
      { content: '이 글 보고 울었어요ㅠ 감사합니다. 혼자가 아니라는 말이 큰 위로가 되네요' },
      { content: '맞아요 자기 돌봄 중요해요! 부모가 지치면 아이한테도 안 좋으니까요', replies: [
        { content: '부모님 번아웃 조심하세요. 상담 받는 것도 좋아요!' },
      ]},
      { content: '우리 아이가 특별하다는 거 맞아요. 장점을 봐야 하는데 자꾸 잊게 되네요ㅠ' },
      { content: '같이 힘내요! 이 커뮤니티에서 위안 얻고 갑니다' },
      { content: '소리 지르고 후회하는 거... 매일이에요ㅠ 근데 내일은 또 잘 해보려고요' },
    ],
  },
];

// ─── 메인 실행 ───
async function main() {
  console.log('🌱 ADHD 커뮤니티 시드 데이터 삽입 시작...\n');

  // 1. 기존 시드 데이터 존재 확인
  const { count: existingCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true });

  if (existingCount && existingCount > 0) {
    console.log(`⚠️  이미 ${existingCount}개의 게시글이 존재합니다.`);
    console.log('   기존 데이터를 삭제하고 새로 삽입합니다...\n');

    // 댓글 먼저 삭제 (FK 제약)
    await supabase.from('comments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('likes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('posts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('   기존 데이터 삭제 완료.\n');
  }

  // 2. boards 테이블에서 slug → id 매핑
  const { data: boards, error: boardError } = await supabase
    .from('boards')
    .select('id, slug');

  if (boardError || !boards) {
    console.error('❌ 게시판 조회 실패:', boardError);
    process.exit(1);
  }

  const boardMap = new Map(boards.map((b) => [b.slug, b.id]));
  console.log(`📋 게시판 ${boards.length}개 로드 완료:`, [...boardMap.keys()].join(', '));

  // 3. 게시글 삽입
  let totalPosts = 0;
  let totalComments = 0;

  for (const seedPost of SEED_POSTS) {
    const boardId = boardMap.get(seedPost.slug);
    if (!boardId) {
      console.warn(`⚠️  게시판 '${seedPost.slug}' 없음, 건너뜀: ${seedPost.title}`);
      continue;
    }

    // 인기도에 따른 view_count, like_count 설정
    let viewCount: number;
    let likeCount: number;
    switch (seedPost.popularity) {
      case 'hot':
        viewCount = randomInt(200, 800);
        likeCount = randomInt(15, 50);
        break;
      case 'normal':
        viewCount = randomInt(30, 150);
        likeCount = randomInt(2, 10);
        break;
      case 'new':
        viewCount = randomInt(5, 30);
        likeCount = randomInt(0, 3);
        break;
    }

    const createdAt = randomDate(seedPost.daysAgo);
    const nickname = seedPost.nickname || pickRandom(NICKNAMES);

    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        board_id: boardId,
        title: seedPost.title,
        content: seedPost.content,
        author_hash: randomHash(),
        author_nickname: nickname,
        view_count: viewCount,
        like_count: likeCount,
        comment_count: 0, // 트리거가 자동 업데이트
        created_at: createdAt,
        updated_at: createdAt,
      })
      .select('id')
      .single();

    if (postError || !post) {
      console.error(`❌ 게시글 삽입 실패: ${seedPost.title}`, postError);
      continue;
    }

    totalPosts++;

    // 4. 댓글 삽입
    for (const comment of seedPost.comments) {
      const commentCreatedAt = new Date(
        new Date(createdAt).getTime() + randomInt(600, 86400) * 1000
      ).toISOString();

      const { data: parentComment, error: commentError } = await supabase
        .from('comments')
        .insert({
          post_id: post.id,
          content: comment.content,
          author_hash: randomHash(),
          author_nickname: comment.nickname || pickRandom(NICKNAMES),
          created_at: commentCreatedAt,
        })
        .select('id')
        .single();

      if (commentError || !parentComment) {
        console.error(`  ❌ 댓글 삽입 실패:`, commentError);
        continue;
      }
      totalComments++;

      // 대댓글 삽입
      if (comment.replies) {
        for (const reply of comment.replies) {
          const replyCreatedAt = new Date(
            new Date(commentCreatedAt).getTime() + randomInt(300, 43200) * 1000
          ).toISOString();

          const { error: replyError } = await supabase.from('comments').insert({
            post_id: post.id,
            parent_id: parentComment.id,
            content: reply.content,
            author_hash: randomHash(),
            author_nickname: reply.nickname || pickRandom(NICKNAMES),
            created_at: replyCreatedAt,
          });

          if (replyError) {
            console.error(`  ❌ 대댓글 삽입 실패:`, replyError);
            continue;
          }
          totalComments++;
        }
      }
    }

    console.log(
      `  ✅ [${seedPost.slug}] "${seedPost.title}" (댓글 ${seedPost.comments.length}개${
        seedPost.comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0) > 0
          ? ` + 대댓글 ${seedPost.comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)}개`
          : ''
      })`
    );
  }

  console.log(`\n✨ 시드 데이터 삽입 완료!`);
  console.log(`   📝 게시글: ${totalPosts}개`);
  console.log(`   💬 댓글: ${totalComments}개`);
  console.log(`\n🔗 사이트 확인: https://adhd-community-gold.vercel.app`);
}

main().catch(console.error);
