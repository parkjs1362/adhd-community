'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';


export default function PushSubscribeButton() {
  const [state, setState] = useState<'idle' | 'subscribed' | 'denied' | 'loading'>('idle');

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    if (Notification.permission === 'denied') {
      setState('denied');
      return;
    }
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        if (sub) setState('subscribed');
      });
    });
  }, []);

  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;
  if (state === 'denied') return null;

  async function handleSubscribe() {
    setState('loading');
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setState('denied');
        return;
      }

      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      });

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription }),
      });

      setState('subscribed');
    } catch {
      setState('idle');
    }
  }

  async function handleUnsubscribe() {
    setState('loading');
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setState('idle');
    } catch {
      setState('subscribed');
    }
  }

  if (state === 'subscribed') {
    return (
      <button
        onClick={handleUnsubscribe}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <BellOff className="w-3.5 h-3.5" />
        알림 해제
      </button>
    );
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={state === 'loading'}
      className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors disabled:opacity-50"
    >
      <Bell className="w-3.5 h-3.5" />
      {state === 'loading' ? '처리 중...' : '댓글 알림 받기'}
    </button>
  );
}
