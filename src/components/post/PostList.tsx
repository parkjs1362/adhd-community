import PostCard from './PostCard';

interface PostListProps {
  posts: Array<{
    id: string;
    title: string;
    author_nickname: string;
    view_count: number;
    like_count: number;
    comment_count: number;
    created_at: string;
    board?: { name: string; slug: string } | null;
  }>;
  showBoard?: boolean;
  emptyMessage?: string;
}

export default function PostList({ posts, showBoard = false, emptyMessage = '게시글이 없습니다.' }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="card-elevated py-16 text-center">
        <div className="text-4xl mb-3 opacity-30">📝</div>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="card-elevated overflow-hidden stagger-children">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} showBoard={showBoard} />
      ))}
    </div>
  );
}
