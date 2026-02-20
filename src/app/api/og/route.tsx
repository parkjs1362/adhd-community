import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? 'ADHD 커뮤니티';
  const board = searchParams.get('board') ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 22, color: '#888', marginBottom: 28 }}>
          {`🧠 ADHD 커뮤니티${board ? ` · ${board}` : ''}`}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 52,
            fontWeight: 700,
            color: '#111',
            textAlign: 'center',
            lineHeight: 1.4,
            maxWidth: 900,
          }}
        >
          {title.length > 60 ? title.slice(0, 60) + '...' : title}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
