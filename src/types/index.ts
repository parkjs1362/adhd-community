export interface Board {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Post {
  id: string;
  board_id: string;
  title: string;
  content: string;
  author_hash: string;
  author_nickname: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  // joined
  board?: Board;
}

export interface Comment {
  id: string;
  post_id: string;
  parent_id: string | null;
  content: string;
  author_hash: string;
  author_nickname: string;
  like_count: number;
  is_hidden: boolean;
  created_at: string;
  // joined
  replies?: Comment[];
}

export interface Like {
  id: string;
  target_type: 'post' | 'comment';
  target_id: string;
  liker_hash: string;
  created_at: string;
}

export interface Report {
  id: string;
  target_type: 'post' | 'comment';
  target_id: string;
  reason: string;
  reporter_hash: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  created_at: string;
}

export type SortOption = 'latest' | 'popular' | 'comments';
export type PopularPeriod = '1h' | '6h' | '24h';
