import { notFound } from 'next/navigation';
import { getPost } from '@/app/actions/posts';
import { getComments } from '@/app/actions/comments';
import { checkLiked } from '@/app/actions/likes';
import PostDetail from '@/components/post/PostDetail';
import CommentList from '@/components/comment/CommentList';
import CommentForm from '@/components/comment/CommentForm';
import AdBanner from '@/components/ads/AdBanner';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return {};
  return {
    title: post.title,
    description: post.content.slice(0, 100),
    openGraph: {
      title: post.title,
      description: post.content.slice(0, 100),
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="card-elevated p-6 sm:p-8">
        <PostDetail post={post} initialLiked={liked} />
      </div>

      <AdBanner slot="post-bottom" format="rectangle" className="my-6" />

      <div className="card-elevated p-6 sm:p-8">
        <CommentList postId={id} comments={comments} />
        <CommentForm postId={id} />
      </div>
    </div>
  );
}
