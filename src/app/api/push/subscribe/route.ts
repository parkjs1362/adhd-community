import { NextRequest, NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { createHash } from 'crypto';

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getAuthorHash(): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || headersList.get('x-real-ip') || 'unknown';
  return createHash('sha256')
    .update(ip + (process.env.HASH_SALT || 'adhd-community-salt'))
    .digest('hex')
    .slice(0, 16);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscription } = body;

    if (!subscription?.endpoint) {
      return NextResponse.json({ error: '유효하지 않은 구독 정보입니다.' }, { status: 400 });
    }

    const authorHash = await getAuthorHash();
    const admin = getAdminClient();

    const { error } = await admin.from('push_subscriptions').upsert(
      {
        author_hash: authorHash,
        endpoint: subscription.endpoint,
        subscription,
      },
      { onConflict: 'author_hash,endpoint' }
    );

    if (error) {
      return NextResponse.json({ error: '구독 저장에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '요청 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json({ error: '유효하지 않은 요청입니다.' }, { status: 400 });
    }

    const authorHash = await getAuthorHash();
    const admin = getAdminClient();

    await admin
      .from('push_subscriptions')
      .delete()
      .eq('author_hash', authorHash)
      .eq('endpoint', endpoint);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '요청 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
