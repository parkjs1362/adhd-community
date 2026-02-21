import PostsClient from './PostsClient';
import { getAdminPosts } from '@/app/actions/admin';

interface Props {
  searchParams: Promise<{ page?: string; showHidden?: string }>;
}

export default async function AdminPostsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const showHidden = params.showHidden === 'true';
  const { posts, total } = await getAdminPosts(page, showHidden);

  return (
    <PostsClient
      posts={posts}
      total={total}
      page={page}
      showHidden={showHidden}
    />
  );
}
