'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Menu, X, PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SITE_NAME, BOARDS } from '@/lib/constants';
import { useRouter } from 'next/navigation';

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
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-800 shrink-0">
            <span className="text-[#4A90D9]">●</span>
            {SITE_NAME}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {BOARDS.map((board) => (
              <Link
                key={board.slug}
                href={`/board/${board.slug}`}
                className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
              >
                {board.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-slate-500"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/post/write">
              <Button size="sm" className="hidden sm:flex bg-[#4A90D9] hover:bg-[#3A7BC8] text-white">
                <PenSquare className="h-4 w-4 mr-1" />
                글쓰기
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <form onSubmit={handleSearch} className="pb-3">
            <div className="flex gap-2">
              <Input
                type="search"
                placeholder="검색어를 입력하세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button type="submit" size="sm" className="bg-[#4A90D9] hover:bg-[#3A7BC8] text-white">
                검색
              </Button>
            </div>
          </form>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pb-3 border-t border-slate-100 pt-2">
            {BOARDS.map((board) => (
              <Link
                key={board.slug}
                href={`/board/${board.slug}`}
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: board.color }} />
                {board.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
