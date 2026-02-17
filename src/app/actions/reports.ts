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

export async function reportContent(
  targetType: 'post' | 'comment',
  targetId: string,
  reason: string
) {
  const supabase = await createClient();
  const reporterHash = await getClientHash();

  if (!reason.trim()) {
    return { error: '신고 사유를 입력해주세요.' };
  }

  // 중복 신고 체크
  const { data: existing } = await supabase
    .from('reports')
    .select('id')
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .eq('reporter_hash', reporterHash)
    .maybeSingle();

  if (existing) {
    return { error: '이미 신고한 게시물입니다.' };
  }

  const { error } = await supabase.from('reports').insert({
    target_type: targetType,
    target_id: targetId,
    reason,
    reporter_hash: reporterHash,
  });

  if (error) {
    return { error: '신고 처리에 실패했습니다.' };
  }

  return { success: true };
}
