'use server';

import { createClient } from '@/lib/supabase/server';

export async function searchPosts(
  query: string,
  boardSlug?: string,
  page: number = 1
) {
  const supabase = await createClient();
  const perPage = 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  if (!query.trim()) {
    return { posts: [], total: 0 };
  }

  const safeQuery = query.replace(/[%_,().]/g, (c) => `\\${c}`);

  let dbQuery = supabase
    .from('posts')
    .select('*, board:boards(name, slug)', { count: 'exact' })
    .eq('is_hidden', false)
    .or(`title.ilike.%${safeQuery}%,content.ilike.%${safeQuery}%`)
    .order('created_at', { ascending: false });

  if (boardSlug) {
    const { data: board } = await supabase
      .from('boards')
      .select('id')
      .eq('slug', boardSlug)
      .single();

    if (board) {
      dbQuery = dbQuery.eq('board_id', board.id);
    }
  }

  const { data, count } = await dbQuery.range(from, to);

  return {
    posts: data || [],
    total: count || 0,
  };
}
