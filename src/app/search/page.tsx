import { searchPosts } from '@/app/actions/search';
import PostList from '@/components/post/PostList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import type { Metadata } from 'next';

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export const metadata: Metadata = {
  title: '검색',
};

export default async function SearchPage({ searchParams }: PageProps) {
  const { q, page: pageStr } = await searchParams;
  const page = parseInt(pageStr || '1', 10);

  const result = q ? await searchPosts(q, undefined, page) : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-slate-800 mb-4">검색</h1>

      <form action="/search" method="get" className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            name="q"
            defaultValue={q}
            placeholder="검색어를 입력하세요..."
            className="pl-9"
            autoFocus
          />
        </div>
        <Button type="submit" className="bg-[#4A90D9] hover:bg-[#3A7BC8] text-white">
          검색
        </Button>
      </form>

      {q && result && (
        <div>
          <p className="text-sm text-slate-500 mb-3">
            &quot;{q}&quot; 검색 결과 {result.total}건
          </p>
          <PostList
            posts={result.posts}
            showBoard
            emptyMessage="검색 결과가 없습니다."
          />
        </div>
      )}
    </div>
  );
}
