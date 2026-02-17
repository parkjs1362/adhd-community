import { Suspense } from 'react';
import Link from 'next/link';
import { getPopularPosts, getLatestPostsByBoard } from '@/app/actions/posts';
import PostList from '@/components/post/PostList';
import Sidebar from '@/components/layout/Sidebar';
import AdBanner from '@/components/ads/AdBanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, Flame } from 'lucide-react';

export const revalidate = 60;

async function PopularPosts() {
  const posts = await getPopularPosts('24h');

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
          <Flame className="h-4 w-4 text-accent" />
        </div>
        <h2 className="text-lg font-bold text-foreground">인기글</h2>
      </div>

      <Tabs defaultValue="24h">
        <TabsList className="mb-3 bg-secondary/50 p-0.5 rounded-lg">
          <TabsTrigger value="1h" className="text-xs rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm">1시간</TabsTrigger>
          <TabsTrigger value="6h" className="text-xs rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm">6시간</TabsTrigger>
          <TabsTrigger value="24h" className="text-xs rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm">24시간</TabsTrigger>
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
      {boardsWithPosts.map(({ board, posts }, index) => (
        <div key={board.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 80}ms` }}>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: board.color }} />
              {board.name}
            </h3>
            <Link
              href={`/board/${board.slug}`}
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-0.5 transition-colors"
            >
              더보기 <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="card-elevated overflow-hidden">
            {posts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">게시글이 없습니다.</p>
            ) : (
              posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="flex items-center justify-between px-4 py-2.5 surface-hover border-b border-border/50 last:border-b-0"
                >
                  <span className="text-sm text-foreground/90 truncate flex-1">
                    {post.title}
                    {post.comment_count > 0 && (
                      <span className="text-xs text-primary ml-1.5 font-medium">[{post.comment_count}]</span>
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

function LoadingSkeleton({ height }: { height: string }) {
  return <div className={`skeleton ${height}`} />;
}

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <AdBanner slot="main-top" format="horizontal" className="mb-6" />

      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <Suspense fallback={<LoadingSkeleton height="h-64" />}>
            <PopularPosts />
          </Suspense>

          <Suspense fallback={<LoadingSkeleton height="h-96" />}>
            <LatestByBoard />
          </Suspense>
        </div>

        <Sidebar />
      </div>
    </div>
  );
}
