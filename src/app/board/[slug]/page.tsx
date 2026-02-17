import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostsByBoard } from '@/app/actions/posts';
import PostList from '@/components/post/PostList';
import Sidebar from '@/components/layout/Sidebar';
import AdBanner from '@/components/ads/AdBanner';
import { Button } from '@/components/ui/button';
import { PenSquare } from 'lucide-react';
import { BOARDS } from '@/lib/constants';
import type { Metadata } from 'next';
import type { SortOption } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const board = BOARDS.find(b => b.slug === slug);
  if (!board) return {};
  return {
    title: board.name,
    description: board.description,
  };
}

export function generateStaticParams() {
  return BOARDS.map((board) => ({ slug: board.slug }));
}

export default async function BoardPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageStr, sort: sortStr } = await searchParams;

  const board = BOARDS.find(b => b.slug === slug);
  if (!board) notFound();

  const page = parseInt(pageStr || '1', 10);
  const sort = (sortStr as SortOption) || 'latest';

  const { posts, total } = await getPostsByBoard(slug, page, sort);
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        <Sidebar currentSlug={slug} />

        <div className="flex-1 min-w-0 animate-fade-in-up">
          {/* Board Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full ring-2 ring-offset-2 ring-offset-background" style={{ backgroundColor: board.color, boxShadow: `0 0 0 2px ${board.color}30` }} />
                {board.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">{board.description}</p>
            </div>
            <Link href={`/post/write?board=${slug}`}>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
                <PenSquare className="h-4 w-4 mr-1.5" />
                글쓰기
              </Button>
            </Link>
          </div>

          {/* Sort Tabs */}
          <div className="flex gap-1.5 mb-4">
            {([
              { value: 'latest', label: '최신순' },
              { value: 'popular', label: '인기순' },
              { value: 'comments', label: '댓글순' },
            ] as const).map((option) => (
              <Link
                key={option.value}
                href={`/board/${slug}?sort=${option.value}`}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${
                  sort === option.value
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-muted-foreground/60 mb-3 px-1 flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-secondary flex items-center justify-center text-[8px]">i</span>
            본 게시판의 정보는 의학적 조언이 아닙니다.
          </div>

          <PostList posts={posts} emptyMessage="아직 게시글이 없습니다. 첫 글을 작성해보세요!" />

          <AdBanner slot="board-bottom" format="rectangle" className="mt-6" />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-1 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/board/${slug}?page=${p}&sort=${sort}`}
                  className={`w-8 h-8 flex items-center justify-center text-sm rounded-lg transition-all ${
                    p === page
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
