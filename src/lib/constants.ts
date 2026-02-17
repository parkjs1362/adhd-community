export const SITE_NAME = 'ADHD 커뮤니티';
export const SITE_DESCRIPTION = '한국 ADHD 당사자와 부모를 위한 오픈 커뮤니티';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://adhd-community.vercel.app';

export const BOARDS = [
  { name: '자유게시판', slug: 'free', description: 'ADHD 관련 자유로운 이야기', color: '#007AFF' },
  { name: 'ADHD 정보', slug: 'info', description: '약물, 치료, 논문, 뉴스 등 정보 공유', color: '#34C759' },
  { name: '일상 공유', slug: 'daily', description: '일상 속 ADHD 경험과 팁', color: '#FF9F0A' },
  { name: '약물/치료 후기', slug: 'treatment', description: '약물 복용, 치료 경험 후기', color: '#AF52DE' },
  { name: '부모 게시판', slug: 'parents', description: 'ADHD 자녀를 둔 부모를 위한 공간', color: '#FF2D55' },
] as const;

export const POSTS_PER_PAGE = 20;
export const MAX_TITLE_LENGTH = 100;
export const RECOMMENDED_TITLE_LENGTH = 50;
export const HOT_THRESHOLD = 10;
export const NEW_THRESHOLD_HOURS = 24;

export const RATE_LIMIT = {
  POST: 60 * 1000,
  COMMENT: 30 * 1000,
} as const;
