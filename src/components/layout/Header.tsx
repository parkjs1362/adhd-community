'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Menu, X, PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SITE_NAME, BOARDS } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-11 sm:h-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-[15px] font-bold text-foreground tracking-tight">
              {SITE_NAME}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {BOARDS.map((board) => (
              <Link
                key={board.slug}
                href={`/board/${board.slug}`}
                className="px-2.5 py-1.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-all duration-200"
              >
                {board.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5">
            <ThemeToggle />
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <Link href="/post/write" className="hidden sm:block ml-1">
              <Button size="sm" className="h-8 px-3.5 text-[13px] font-medium rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                <PenSquare className="h-3.5 w-3.5 mr-1.5" />
                글쓰기
              </Button>
            </Link>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </div>

        {/* Search */}
        {isSearchOpen && (
          <form onSubmit={handleSearch} className="pb-3 animate-slide-down">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="검색어를 입력하세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 bg-muted/50 border-0 rounded-xl focus:bg-card focus:shadow-sm transition-all duration-200"
                autoFocus
              />
            </div>
          </form>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pb-3 animate-slide-down">
            <div className="space-y-0.5">
              {BOARDS.map((board) => (
                <Link
                  key={board.slug}
                  href={`/board/${board.slug}`}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground surface-hover rounded-xl"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: board.color }} />
                  {board.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
