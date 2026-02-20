import { searchPosts } from '@/app/actions/search';
import PostList from '@/components/post/PostList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export const metadata: Metadata = {
  title: '검색',
};

const PER_PAGE = 20;

export default async function SearchPage({ searchParams }: PageProps) {
  const { q, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || '1', 10));

  const result = q ? await searchPosts(q, undefined, page) : null;
  const totalPages = result ? Math.ceil(result.total / PER_PAGE) : 1;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-5 tracking-tight">검색</h1>

      <form action="/search" method="get" className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={q}
            placeholder="검색어를 입력하세요..."
            className="pl-9 bg-muted/40 border-0 rounded-2xl"
            autoFocus
          />
        </div>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5">
          검색
        </Button>
      </form>

      {q && result && (
        <div className="animate-fade-in">
          <p className="text-sm text-muted-foreground mb-3">
            &quot;{q}&quot; 검색 결과{' '}
            <span className="text-primary font-medium">{result.total}</span>건
            {totalPages > 1 && (
              <span className="ml-2 text-muted-foreground/60">
                ({page} / {totalPages} 페이지)
              </span>
            )}
          </p>

          <PostList
            posts={result.posts}
            showBoard
            emptyMessage="검색 결과가 없습니다."
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {page > 1 ? (
                <Link
                  href={`/search?q=${encodeURIComponent(q)}&page=${page - 1}`}
                  className="flex items-center gap-1 px-4 py-2 text-sm rounded-full border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  이전
                </Link>
              ) : (
                <span className="flex items-center gap-1 px-4 py-2 text-sm rounded-full text-muted-foreground/30 cursor-not-allowed">
                  <ChevronLeft className="h-4 w-4" />
                  이전
                </span>
              )}

              <span className="text-sm text-muted-foreground px-2">
                {page} / {totalPages}
              </span>

              {page < totalPages ? (
                <Link
                  href={`/search?q=${encodeURIComponent(q)}&page=${page + 1}`}
                  className="flex items-center gap-1 px-4 py-2 text-sm rounded-full border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                >
                  다음
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="flex items-center gap-1 px-4 py-2 text-sm rounded-full text-muted-foreground/30 cursor-not-allowed">
                  다음
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
