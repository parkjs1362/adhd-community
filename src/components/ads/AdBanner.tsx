'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
}

export default function AdBanner({ slot, format = 'auto', responsive = true, className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isProduction = process.env.NODE_ENV === 'production';
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (!isProduction || !clientId) return;
    try {
      // @ts-expect-error - AdSense global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense load failure ignored
    }
  }, [isProduction, clientId]);

  if (!isProduction || !clientId) {
    return (
      <div
        className={`bg-muted/30 border border-dashed border-border/40 rounded-2xl flex items-center justify-center text-muted-foreground/20 text-xs ${className}`}
        style={{ minHeight: format === 'rectangle' ? 250 : 90 }}
      >
        AD
      </div>
    );
  }

  return (
    <div ref={adRef} className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
