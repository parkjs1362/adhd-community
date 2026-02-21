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
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t sm:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-center justify-around h-[60px] max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const isWrite = item.href === '/post/write';

          if (isWrite) {
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center gap-0.5 py-1.5">
                <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-sm">
                  <item.icon className="h-5 w-5 text-primary-foreground" strokeWidth={2.2} />
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1.5 rounded-xl transition-colors duration-200 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.2 : 1.8} />
              <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
