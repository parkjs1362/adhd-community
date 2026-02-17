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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex gap-8">
        <Sidebar currentSlug={slug} />

        <div className="flex-1 min-w-0 animate-fade-in">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2 tracking-tight">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: board.color }} />
                {board.name}
              </h1>
              <p className="text-[13px] text-muted-foreground mt-0.5">{board.description}</p>
            </div>
            <Link href={`/post/write?board=${slug}`}>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-sm">
                <PenSquare className="h-3.5 w-3.5 mr-1.5" />
                글쓰기
              </Button>
            </Link>
          </div>

          <div className="flex gap-1 mb-4">
            {([
              { value: 'latest', label: '최신순' },
              { value: 'popular', label: '인기순' },
              { value: 'comments', label: '댓글순' },
            ] as const).map((option) => (
              <Link
                key={option.value}
                href={`/board/${slug}?sort=${option.value}`}
                className={`px-3.5 py-2 text-xs font-medium rounded-full transition-all duration-200 ${
                  sort === option.value
                    ? 'bg-foreground text-background shadow-sm'
                    : 'bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>

          <p className="text-[11px] text-muted-foreground/40 mb-3">
            본 게시판의 정보는 의학적 조언이 아닙니다.
          </p>

          <PostList posts={posts} emptyMessage="아직 게시글이 없습니다. 첫 글을 작성해보세요!" />

          <AdBanner slot="board-bottom" format="rectangle" className="mt-6" />

          {totalPages > 1 && (
            <div className="flex justify-center gap-1 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/board/${slug}?page=${p}&sort=${sort}`}
                  className={`w-8 h-8 flex items-center justify-center text-[13px] rounded-full transition-all duration-200 ${
                    p === page
                      ? 'bg-foreground text-background font-medium'
                      : 'text-muted-foreground hover:bg-muted'
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
