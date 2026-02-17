'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, PenSquare, Search } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Home, label: '홈' },
    { href: '/board/free', icon: LayoutGrid, label: '게시판' },
    { href: '/post/write', icon: PenSquare, label: '글쓰기' },
    { href: '/search', icon: Search, label: '검색' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t sm:hidden">
      <div className="flex items-center justify-around h-14 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {isActive && (
                <span className="absolute -top-0.5 w-4 h-0.5 rounded-full bg-primary" />
              )}
              <item.icon className={`h-5 w-5 transition-transform ${isActive ? 'scale-105' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
