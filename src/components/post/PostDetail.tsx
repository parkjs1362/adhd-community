'use client';

import { useState } from 'react';
import { Heart, Flag, Trash2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toggleLike } from '@/app/actions/likes';
import { deletePost } from '@/app/actions/posts';
import ReportDialog from '@/components/ui/ReportDialog';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

interface PostDetailProps {
  post: {
    id: string;
    title: string;
    content: string;
    author_nickname: string;
    view_count: number;
    like_count: number;
    comment_count: number;
    created_at: string;
    board?: { name: string; slug: string } | null;
  };
  initialLiked: boolean;
}

export default function PostDetail({ post, initialLiked }: PostDetailProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLike = async () => {
    const result = await toggleLike('post', post.id);
    if ('liked' in result && result.liked !== undefined) {
      const isLiked = result.liked;
      setLiked(isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
    }
  };

  const handleDelete = async () => {
    const password = prompt('글 작성 시 입력한 비밀번호를 입력해주세요:');
    if (!password) return;
    setIsDeleting(true);
    const result = await deletePost(post.id, password);
    setIsDeleting(false);
    if ('error' in result) {
      alert(result.error);
    } else {
      alert('삭제되었습니다.');
      router.push(post.board ? `/board/${post.board.slug}` : '/');
    }
  };

  const readingTime = Math.max(1, Math.ceil(post.content.length / 500));

  return (
    <article className="animate-fade-in">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-0.5 text-sm text-muted-foreground hover:text-primary mb-5 transition-colors duration-200 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          뒤로
        </button>

        {post.board && (
          <Badge variant="secondary" className="mb-3 text-xs font-medium rounded-full bg-muted text-muted-foreground">
            {post.board.name}
          </Badge>
        )}

        <h1 className="text-2xl sm:text-[28px] font-bold text-foreground leading-tight mb-3 tracking-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground flex-wrap">
          <span className="font-medium text-foreground/70">{post.author_nickname}</span>
          <span className="text-muted-foreground/30">·</span>
          <span>{dayjs(post.created_at).format('YYYY.MM.DD HH:mm')}</span>
          <span className="text-muted-foreground/30">·</span>
          <span>조회 {post.view_count}</span>
          <span className="text-muted-foreground/30">·</span>
          <span>약 {readingTime}분</span>
        </div>
      </div>

      <div className="text-base leading-[1.9] whitespace-pre-wrap break-words mb-10 text-foreground/85">
        {post.content}
      </div>

      <div className="flex items-center justify-between py-5 border-t border-border/40">
        <Button
          variant={liked ? 'default' : 'outline'}
          size="sm"
          onClick={handleLike}
          className={`rounded-full transition-colors ${
            liked
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
              : 'text-muted-foreground hover:text-primary'
          }`}
        >
          <Heart className={`h-4 w-4 mr-1.5 ${liked ? 'fill-current' : ''}`} />
          공감 {likeCount}
        </Button>
        <div className="flex items-center gap-1">
          <ReportDialog
            targetType="post"
            targetId={post.id}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive rounded-full"
              >
                <Flag className="h-4 w-4 mr-1" />
                신고
              </Button>
            }
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-muted-foreground hover:text-destructive rounded-full"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            삭제
          </Button>
        </div>
      </div>
    </article>
  );
}
