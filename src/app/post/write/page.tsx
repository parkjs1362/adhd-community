import PostForm from '@/components/post/PostForm';
import type { Metadata } from 'next';

interface PageProps {
  searchParams: Promise<{ board?: string }>;
}

export const metadata: Metadata = {
  title: '글 작성',
};

export default async function WritePage({ searchParams }: PageProps) {
  const { board } = await searchParams;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-foreground mb-6">글 작성</h1>
      <div className="card-elevated p-6">
        <PostForm defaultBoard={board} />
      </div>
    </div>
  );
}
