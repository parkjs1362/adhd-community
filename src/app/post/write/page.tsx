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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-6 tracking-tight">글 작성</h1>
      <div className="card-elevated p-8">
        <PostForm defaultBoard={board} />
      </div>
    </div>
  );
}
