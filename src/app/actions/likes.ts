'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { createHash } from 'crypto';

async function getClientHash(): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || headersList.get('x-real-ip') || 'unknown';
  return createHash('sha256').update(ip + (process.env.HASH_SALT || 'adhd-community-salt')).digest('hex').slice(0, 16);
}

export async function toggleLike(targetType: 'post' | 'comment', targetId: string) {
  const supabase = await createClient();
  const likerHash = await getClientHash();

  const { data, error } = await supabase.rpc('toggle_like', {
    p_target_type: targetType,
    p_target_id: targetId,
    p_liker_hash: likerHash,
  });

  if (error) {
    return { error: '좋아요 처리에 실패했습니다.' };
  }

  return { liked: data as boolean };
}

export async function checkLiked(targetType: 'post' | 'comment', targetId: string) {
  const supabase = await createClient();
  const likerHash = await getClientHash();

  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .eq('liker_hash', likerHash)
    .maybeSingle();

  return !!data;
}
