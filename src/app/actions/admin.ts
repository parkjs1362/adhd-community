'use server';

import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function adminLogin(password: string) {
  const hash = createHash('sha256').update(password).digest('hex');
  if (hash !== process.env.ADMIN_TOKEN_HASH) {
    return { error: '비밀번호가 틀렸습니다.' };
  }
  const cookieStore = await cookies();
  cookieStore.set('admin_token', hash, {
    httpOnly: true,
    maxAge: 86400,
    path: '/',
    sameSite: 'lax',
  });
  return { success: true };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  return { success: true };
}

export async function getAdminStats() {
  const admin = getAdminClient();

  const [postsRes, commentsRes, reportsRes, todayPostsRes] = await Promise.all([
    admin.from('posts').select('*', { count: 'exact', head: true }).eq('is_hidden', false),
    admin.from('comments').select('*', { count: 'exact', head: true }).eq('is_hidden', false),
    admin.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    admin
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
  ]);

  return {
    totalPosts: postsRes.count ?? 0,
    totalComments: commentsRes.count ?? 0,
    pendingReports: reportsRes.count ?? 0,
    todayPosts: todayPostsRes.count ?? 0,
  };
}

export async function getReports(status: 'pending' | 'reviewed' | 'dismissed') {
  const admin = getAdminClient();

  const { data, error } = await admin
    .from('reports')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error || !data) return [];

  // 각 신고에 대상(post/comment) 원문 join
  const enriched = await Promise.all(
    data.map(async (report) => {
      if (report.target_type === 'post') {
        const { data: post } = await admin
          .from('posts')
          .select('id, title, content, is_hidden, board_id')
          .eq('id', report.target_id)
          .single();
        return { ...report, target: post };
      } else {
        const { data: comment } = await admin
          .from('comments')
          .select('id, content, is_hidden, post_id')
          .eq('id', report.target_id)
          .single();
        return { ...report, target: comment };
      }
    })
  );

  return enriched;
}

export async function updateReportStatus(id: string, status: 'reviewed' | 'dismissed') {
  const admin = getAdminClient();
  const { error } = await admin.from('reports').update({ status }).eq('id', id);
  if (error) return { error: '처리에 실패했습니다.' };
  return { success: true };
}

export async function adminHidePost(id: string) {
  const admin = getAdminClient();
  await admin.from('posts').update({ is_hidden: true }).eq('id', id);
  // 관련 신고 reviewed 처리
  await admin
    .from('reports')
    .update({ status: 'reviewed' })
    .eq('target_type', 'post')
    .eq('target_id', id)
    .eq('status', 'pending');
  return { success: true };
}

export async function adminRestorePost(id: string) {
  const admin = getAdminClient();
  await admin.from('posts').update({ is_hidden: false }).eq('id', id);
  return { success: true };
}

export async function adminHideComment(id: string) {
  const admin = getAdminClient();
  await admin.from('comments').update({ is_hidden: true }).eq('id', id);
  // 관련 신고 reviewed 처리
  await admin
    .from('reports')
    .update({ status: 'reviewed' })
    .eq('target_type', 'comment')
    .eq('target_id', id)
    .eq('status', 'pending');
  return { success: true };
}

export async function getAdminPosts(page: number = 1, showHidden: boolean = false) {
  const admin = getAdminClient();
  const PAGE_SIZE = 20;
  const from = (page - 1) * PAGE_SIZE;

  let query = admin
    .from('posts')
    .select('id, title, board_id, board:boards(name, slug), created_at, view_count, is_hidden', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (!showHidden) {
    query = query.eq('is_hidden', false);
  }

  const { data, count, error } = await query;
  if (error) return { posts: [], total: 0 };
  return { posts: data ?? [], total: count ?? 0 };
}
