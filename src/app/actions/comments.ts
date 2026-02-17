'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { createHash } from 'crypto';
import sanitizeHtml from 'sanitize-html';

function sanitize(text: string): string {
  return sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} });
}

async function getClientHash(): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || headersList.get('x-real-ip') || 'unknown';
  return createHash('sha256').update(ip + (process.env.HASH_SALT || 'adhd-community-salt')).digest('hex').slice(0, 16);
}

export async function getComments(postId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .eq('is_hidden', false)
    .order('created_at', { ascending: true });

  if (!data) return [];

  // 트리 구조 변환
  const rootComments = data.filter(c => !c.parent_id);
  const replies = data.filter(c => c.parent_id);

  return rootComments.map(comment => ({
    ...comment,
    replies: replies.filter(r => r.parent_id === comment.id),
  }));
}

export async function createComment(formData: FormData) {
  const supabase = await createClient();
  const authorHash = await getClientHash();

  const postId = formData.get('postId') as string;
  const parentId = formData.get('parentId') as string | null;
  const content = sanitize(formData.get('content') as string || '');
  const nickname = sanitize(formData.get('nickname') as string || '') || '익명';

  if (!content.trim()) {
    return { error: '댓글 내용을 입력해주세요.' };
  }

  // rate limit
  const thirtySecondsAgo = new Date(Date.now() - 30000).toISOString();
  const { count } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('author_hash', authorHash)
    .gte('created_at', thirtySecondsAgo);

  if (count && count > 0) {
    return { error: '댓글은 30초에 1개만 작성 가능합니다.' };
  }

  const { error } = await supabase.from('comments').insert({
    post_id: postId,
    parent_id: parentId || null,
    content,
    author_hash: authorHash,
    author_nickname: nickname,
  });

  if (error) {
    return { error: '댓글 작성에 실패했습니다.' };
  }

  return { success: true };
}
