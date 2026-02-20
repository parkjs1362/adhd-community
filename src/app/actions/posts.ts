'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { createHash } from 'crypto';
import sanitizeHtml from 'sanitize-html';
import type { SortOption, PopularPeriod } from '@/types';

function sanitize(text: string): string {
  return sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

async function getClientHash(): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || headersList.get('x-real-ip') || 'unknown';
  return createHash('sha256').update(ip + (process.env.HASH_SALT || 'adhd-community-salt')).digest('hex').slice(0, 16);
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const authorHash = await getClientHash();

  const title = sanitize(formData.get('title') as string || '');
  const content = sanitize(formData.get('content') as string || '');
  const boardSlug = formData.get('board') as string;
  const nickname = sanitize(formData.get('nickname') as string || '') || '익명';
  const password = formData.get('password') as string || '';

  if (!title.trim() || !content.trim() || !boardSlug) {
    return { error: '제목과 내용을 입력해주세요.' };
  }

  if (title.length > 100) {
    return { error: '제목은 100자 이내로 입력해주세요.' };
  }

  // 게시판 조회
  const { data: board } = await supabase
    .from('boards')
    .select('id')
    .eq('slug', boardSlug)
    .single();

  if (!board) {
    return { error: '존재하지 않는 게시판입니다.' };
  }

  // rate limit 체크
  const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
  const { count } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('author_hash', authorHash)
    .gte('created_at', oneMinuteAgo);

  if (count && count > 0) {
    return { error: '글 작성은 1분에 1회만 가능합니다.' };
  }

  const passwordHash = password
    ? createHash('sha256').update(password).digest('hex').slice(0, 16)
    : null;

  const { data, error } = await supabase
    .from('posts')
    .insert({
      board_id: board.id,
      title,
      content,
      author_hash: authorHash,
      author_nickname: nickname,
      password_hash: passwordHash,
    })
    .select('id')
    .single();

  if (error) {
    return { error: '글 작성에 실패했습니다.' };
  }

  return { data: { id: data.id, boardSlug } };
}

export async function getPost(id: string) {
  const supabase = await createClient();

  // 조회수 증가
  await supabase.rpc('increment_view_count', { post_id: id });

  const { data, error } = await supabase
    .from('posts')
    .select('*, board:boards(*)')
    .eq('id', id)
    .eq('is_hidden', false)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function getPostsByBoard(
  slug: string,
  page: number = 1,
  sort: SortOption = 'latest'
) {
  const supabase = await createClient();
  const perPage = 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  // 게시판 조회
  const { data: board } = await supabase
    .from('boards')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!board) return { board: null, posts: [], total: 0 };

  let query = supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .eq('board_id', board.id)
    .eq('is_hidden', false);

  switch (sort) {
    case 'popular':
      query = query.order('like_count', { ascending: false });
      break;
    case 'comments':
      query = query.order('comment_count', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data: posts, count } = await query.range(from, to);

  return {
    board,
    posts: posts || [],
    total: count || 0,
  };
}

export async function getPopularPosts(period: PopularPeriod = '24h') {
  const supabase = await createClient();

  const hours = period === '1h' ? 1 : period === '6h' ? 6 : 24;
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

  const { data } = await supabase
    .from('posts')
    .select('*, board:boards(name, slug)')
    .eq('is_hidden', false)
    .gte('created_at', since)
    .order('like_count', { ascending: false })
    .limit(20);

  return data || [];
}

export async function getLatestPostsByBoard() {
  const supabase = await createClient();

  const { data: boards } = await supabase
    .from('boards')
    .select('*')
    .order('sort_order');

  if (!boards) return [];

  const results = await Promise.all(
    boards.map(async (board) => {
      const { data: posts } = await supabase
        .from('posts')
        .select('id, title, comment_count, like_count, created_at')
        .eq('board_id', board.id)
        .eq('is_hidden', false)
        .order('created_at', { ascending: false })
        .limit(5);

      return { board, posts: posts || [] };
    })
  );

  return results;
}

export async function updatePost(id: string, title: string, content: string, password: string) {
  const supabase = await createClient();
  const sanitizedTitle = sanitize(title.trim());
  const sanitizedContent = sanitize(content.trim());

  if (!sanitizedTitle || !sanitizedContent) return { error: '제목과 내용을 입력해주세요.' };
  if (sanitizedTitle.length > 200) return { error: '제목은 200자 이하로 입력해주세요.' };

  const passwordHash = createHash('sha256').update(password).digest('hex').slice(0, 16);
  const { data } = await supabase.from('posts').select('password_hash').eq('id', id).single();

  if (!data || data.password_hash !== passwordHash) {
    return { error: '비밀번호가 일치하지 않습니다.' };
  }

  const { error } = await supabase
    .from('posts')
    .update({ title: sanitizedTitle, content: sanitizedContent, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { error: '수정에 실패했습니다.' };
  return { success: true };
}

export async function deletePost(id: string, password: string) {
  const supabase = await createClient();
  const passwordHash = createHash('sha256').update(password).digest('hex').slice(0, 16);

  const { data } = await supabase
    .from('posts')
    .select('password_hash')
    .eq('id', id)
    .single();

  if (!data || data.password_hash !== passwordHash) {
    return { error: '비밀번호가 일치하지 않습니다.' };
  }

  await supabase.from('posts').update({ is_hidden: true }).eq('id', id);
  return { success: true };
}
