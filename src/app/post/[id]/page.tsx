import { notFound } from 'next/navigation';
import { getPost } from '@/app/actions/posts';
import { getComments } from '@/app/actions/comments';
import { checkLiked } from '@/app/actions/likes';
import PostDetail from '@/components/post/PostDetail';
import CommentList from '@/components/comment/CommentList';
import CommentForm from '@/components/comment/CommentForm';
import AdBanner from '@/components/ads/AdBanner';
import PushSubscribeButton from '@/components/PushSubscribeButton';
import { SITE_URL } from '@/lib/constants';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return {};
  const description = post.content.slice(0, 120).replace(/\n/g, ' ');
  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.created_at,
      images: [{
        url: `/api/og?title=${encodeURIComponent(post.title)}&board=${encodeURIComponent((post.board as { name?: string } | null)?.name || '')}`,
        width: 1200,
        height: 630,
        alt: post.title,
      }],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) notFound();

  const [comments, liked] = await Promise.all([
    getComments(id),
    checkLiked('post', id),
  ]);

  const board = post.board as { name?: string; slug?: string } | null;
  const postUrl = `${SITE_URL}/post/${id}`;

  const discussionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    headline: post.title,
    text: post.content.slice(0, 200),
    datePublished: post.created_at,
    author: { '@type': 'Person', name: post.author_nickname || '익명' },
    interactionStatistic: [
      { '@type': 'InteractionCounter', interactionType: 'https://schema.org/LikeAction', userInteractionCount: post.like_count ?? 0 },
      { '@type': 'InteractionCounter', interactionType: 'https://schema.org/CommentAction', userInteractionCount: post.comment_count ?? 0 },
    ],
    url: postUrl,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
      ...(board?.slug ? [{ '@type': 'ListItem', position: 2, name: board.name || '게시판', item: `${SITE_URL}/board/${board.slug}` }] : []),
      { '@type': 'ListItem', position: board?.slug ? 3 : 2, name: post.title, item: postUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(discussionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="card-elevated p-8 sm:p-10">
          <PostDetail post={post} initialLiked={liked} />
        </div>

        <AdBanner slot="post-bottom" format="rectangle" className="my-6" />

        <div className="card-elevated p-8 sm:p-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-foreground">댓글</span>
            <PushSubscribeButton />
          </div>
          <CommentList postId={id} comments={comments} />
          <CommentForm postId={id} />
        </div>
      </div>
    </>
  );
}
