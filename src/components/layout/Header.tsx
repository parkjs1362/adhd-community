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
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-[15px] font-semibold text-foreground tracking-tight">
              {SITE_NAME}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {BOARDS.map((board) => (
              <Link
                key={board.slug}
                href={`/board/${board.slug}`}
                className="px-3 py-1.5 text-[13px] text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              >
                {board.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>
            <Link href="/post/write" className="hidden sm:block ml-1">
              <Button size="sm" className="h-8 px-3 text-[13px] font-medium rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <PenSquare className="h-3.5 w-3.5 mr-1.5" />
                글쓰기
              </Button>
            </Link>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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
                placeholder="검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-muted/60 border-0 rounded-xl focus:bg-card"
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
