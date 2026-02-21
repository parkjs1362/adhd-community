'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { createHash } from 'crypto';
import sanitizeHtml from 'sanitize-html';
import webpush from 'web-push';
import { SITE_URL } from '@/lib/constants';

function getAdminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

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

  // Web Push 발송 (fire-and-forget, 실패해도 댓글 작성에 영향 없음)
  try {
    if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
      webpush.setVapidDetails(
        process.env.VAPID_EMAIL || 'mailto:admin@adhd-community.com',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      );
    } else {
      return { success: true };
    }
    const admin = getAdminSupabase();
    const postUrl = `${SITE_URL}/post/${postId}`;
    const preview = content.slice(0, 30);

    if (parentId) {
      // 대댓글: 부모 댓글 작성자에게 알림
      const { data: parentComment } = await admin
        .from('comments')
        .select('author_hash, author_nickname')
        .eq('id', parentId)
        .single();

      if (parentComment && parentComment.author_hash !== authorHash) {
        const { data: subs } = await admin
          .from('push_subscriptions')
          .select('endpoint, subscription')
          .eq('author_hash', parentComment.author_hash);

        if (subs && subs.length > 0) {
          const payload = JSON.stringify({
            title: 'ADHD 커뮤니티',
            body: `${nickname}님이 답글을 남겼습니다: ${preview}`,
            url: postUrl,
          });
          await Promise.allSettled(
            subs.map(async (s) => {
              try {
                await webpush.sendNotification(s.subscription, payload);
              } catch (err: unknown) {
                const statusCode = (err as { statusCode?: number })?.statusCode;
                if (statusCode === 410 || statusCode === 404) {
                  await admin.from('push_subscriptions').delete().eq('endpoint', s.endpoint);
                }
              }
            })
          );
        }
      }
    } else {
      // 댓글: 게시글 작성자에게 알림
      const { data: post } = await admin
        .from('posts')
        .select('author_hash, author_nickname')
        .eq('id', postId)
        .single();

      if (post && post.author_hash !== authorHash) {
        const { data: subs } = await admin
          .from('push_subscriptions')
          .select('endpoint, subscription')
          .eq('author_hash', post.author_hash);

        if (subs && subs.length > 0) {
          const payload = JSON.stringify({
            title: 'ADHD 커뮤니티',
            body: `${nickname}님이 댓글을 남겼습니다: ${preview}`,
            url: postUrl,
          });
          await Promise.allSettled(
            subs.map(async (s) => {
              try {
                await webpush.sendNotification(s.subscription, payload);
              } catch (err: unknown) {
                const statusCode = (err as { statusCode?: number })?.statusCode;
                if (statusCode === 410 || statusCode === 404) {
                  await admin.from('push_subscriptions').delete().eq('endpoint', s.endpoint);
                }
              }
            })
          );
        }
      }
    }
  } catch {
    // Push 발송 실패는 무시
  }

  return { success: true };
}

export async function updateComment(id: string, content: string) {
  const { createClient: createAdminClient } = await import('@supabase/supabase-js');
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const authorHash = await getClientHash();
  const sanitizedContent = sanitize(content.trim());

  if (!sanitizedContent) return { error: '내용을 입력해주세요.' };
  if (sanitizedContent.length > 1000) return { error: '댓글은 1000자 이하입니다.' };

  const { data } = await admin.from('comments').select('author_hash').eq('id', id).single();
  if (!data || data.author_hash !== authorHash) {
    return { error: '본인이 작성한 댓글만 수정할 수 있습니다.' };
  }

  await admin.from('comments').update({ content: sanitizedContent }).eq('id', id);
  return { success: true };
}

export async function deleteComment(id: string) {
  const { createClient: createAdminClient } = await import('@supabase/supabase-js');
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const authorHash = await getClientHash();

  const { data } = await admin
    .from('comments')
    .select('author_hash')
    .eq('id', id)
    .single();

  if (!data || data.author_hash !== authorHash) {
    return { error: '본인이 작성한 댓글만 삭제할 수 있습니다.' };
  }

  await admin.from('comments').update({ is_hidden: true }).eq('id', id);
  return { success: true };
}
