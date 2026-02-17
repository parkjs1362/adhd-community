import { Suspense } from 'react';
import Link from 'next/link';
import { getPopularPosts, getLatestPostsByBoard } from '@/app/actions/posts';
import PostList from '@/components/post/PostList';
import Sidebar from '@/components/layout/Sidebar';
import AdBanner from '@/components/ads/AdBanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight } from 'lucide-react';

export const revalidate = 60; // 1분 캐시

async function PopularPosts() {
  const posts = await getPopularPosts('24h');

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-slate-800">🔥 인기글</h2>
      </div>

      <Tabs defaultValue="24h">
        <TabsList className="mb-3">
          <TabsTrigger value="1h" className="text-xs">1시간</TabsTrigger>
          <TabsTrigger value="6h" className="text-xs">6시간</TabsTrigger>
          <TabsTrigger value="24h" className="text-xs">24시간</TabsTrigger>
        </TabsList>
        <TabsContent value="24h">
          <PostList posts={posts} showBoard emptyMessage="아직 인기글이 없습니다." />
        </TabsContent>
        <TabsContent value="6h">
          <PopularPostsByPeriod period="6h" />
        </TabsContent>
        <TabsContent value="1h">
          <PopularPostsByPeriod period="1h" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

async function PopularPostsByPeriod({ period }: { period: '1h' | '6h' }) {
  const posts = await getPopularPosts(period);
  return <PostList posts={posts} showBoard emptyMessage="해당 기간 인기글이 없습니다." />;
}

async function LatestByBoard() {
  const boardsWithPosts = await getLatestPostsByBoard();

  return (
    <div className="space-y-6 mt-8">
      {boardsWithPosts.map(({ board, posts }) => (
        <div key={board.id}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-700">{board.name}</h3>
            <Link
              href={`/board/${board.slug}`}
              className="text-xs text-slate-400 hover:text-[#4A90D9] flex items-center gap-0.5"
            >
              더보기 <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="bg-white rounded-lg border border-slate-200">
            {posts.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">게시글이 없습니다.</p>
            ) : (
              posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                >
                  <span className="text-sm text-slate-700 truncate flex-1">
                    {post.title}
                    {post.comment_count > 0 && (
                      <span className="text-xs text-[#4A90D9] ml-1">[{post.comment_count}]</span>
                    )}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <AdBanner slot="main-top" format="horizontal" className="mb-6" />

      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <Suspense fallback={<div className="animate-pulse bg-slate-100 rounded-lg h-64" />}>
            <PopularPosts />
          </Suspense>

          <Suspense fallback={<div className="animate-pulse bg-slate-100 rounded-lg h-96 mt-8" />}>
            <LatestByBoard />
          </Suspense>
        </div>

        <Sidebar />
      </div>
    </div>
  );
}
