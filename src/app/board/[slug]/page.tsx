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

        <div className="flex-1 min-w-0">
          {/* 게시판 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: board.color }} />
                {board.name}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">{board.description}</p>
            </div>
            <Link href={`/post/write?board=${slug}`}>
              <Button size="sm" className="bg-[#4A90D9] hover:bg-[#3A7BC8] text-white">
                <PenSquare className="h-4 w-4 mr-1" />
                글쓰기
              </Button>
            </Link>
          </div>

          {/* 정렬 탭 */}
          <div className="flex gap-1 mb-3">
            {([
              { value: 'latest', label: '최신순' },
              { value: 'popular', label: '인기순' },
              { value: 'comments', label: '댓글순' },
            ] as const).map((option) => (
              <Link
                key={option.value}
                href={`/board/${slug}?sort=${option.value}`}
                className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                  sort === option.value
                    ? 'bg-[#4A90D9] text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>

          {/* 면책 문구 */}
          <p className="text-xs text-slate-400 mb-3 px-1">
            ⚕️ 본 게시판의 정보는 의학적 조언이 아닙니다. 전문적인 진단과 치료는 의료 전문가와 상담하세요.
          </p>

          <PostList posts={posts} emptyMessage="아직 게시글이 없습니다. 첫 글을 작성해보세요!" />

          <AdBanner slot="board-bottom" format="rectangle" className="mt-6" />

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-1 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/board/${slug}?page=${p}&sort=${sort}`}
                  className={`w-8 h-8 flex items-center justify-center text-sm rounded-md ${
                    p === page
                      ? 'bg-[#4A90D9] text-white'
                      : 'text-slate-500 hover:bg-slate-100'
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
