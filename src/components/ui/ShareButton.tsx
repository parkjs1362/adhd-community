'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      className="text-muted-foreground hover:text-primary rounded-full"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-1" />
          복사됨
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4 mr-1" />
          공유
        </>
      )}
    </Button>
  );
}
