'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'cookie-consent-accepted';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm px-4 py-3 sm:py-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
          이 사이트는 서비스 개선 및 맞춤 광고를 위해 쿠키를 사용합니다.{' '}
          <Link href="/privacy" className="text-primary hover:underline">
            자세히 보기
          </Link>
        </p>
        <button
          onClick={handleAccept}
          className="shrink-0 rounded-lg bg-primary px-4 py-2 text-xs sm:text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          동의
        </button>
      </div>
    </div>
  );
}
