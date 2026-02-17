'use client';

import { useState } from 'react';
import { Heart, Flag, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toggleLike } from '@/app/actions/likes';
import { deletePost } from '@/app/actions/posts';
import { reportContent } from '@/app/actions/reports';
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
  const [isReporting, setIsReporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLike = async () => {
    const result = await toggleLike('post', post.id);
    if ('liked' in result && result.liked !== undefined) {
      const isLiked = result.liked;
      setLiked(isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
    }
  };

  const handleReport = async () => {
    const reason = prompt('신고 사유를 입력해주세요:');
    if (!reason) return;
    setIsReporting(true);
    const result = await reportContent('post', post.id, reason);
    setIsReporting(false);
    if ('error' in result) {
      alert(result.error);
    } else {
      alert('신고가 접수되었습니다.');
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
    <article className="animate-fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          뒤로
        </button>

        {post.board && (
          <Badge variant="secondary" className="mb-3 text-xs font-medium bg-secondary text-secondary-foreground">
            {post.board.name}
          </Badge>
        )}

        <h1 className="text-xl font-bold text-foreground leading-tight mb-3">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground/80">{post.author_nickname}</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>{dayjs(post.created_at).format('YYYY.MM.DD HH:mm')}</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>조회 {post.view_count}</span>
          <Badge variant="outline" className="text-[10px] text-muted-foreground border-border">
            약 {readingTime}분
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none text-[15px] leading-[1.8] whitespace-pre-wrap break-words mb-8 text-foreground/90">
        {post.content}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between py-4 border-t border-b border-border">
        <div className="flex items-center gap-2">
          <Button
            variant={liked ? 'default' : 'outline'}
            size="sm"
            onClick={handleLike}
            className={`rounded-lg transition-all ${
              liked
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                : 'border-border text-muted-foreground hover:text-primary hover:border-primary/30'
            }`}
          >
            <Heart className={`h-4 w-4 mr-1.5 ${liked ? 'fill-current' : ''}`} />
            공감 {likeCount}
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReport}
            disabled={isReporting}
            className="text-muted-foreground hover:text-destructive rounded-lg"
          >
            <Flag className="h-4 w-4 mr-1" />
            신고
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-muted-foreground hover:text-destructive rounded-lg"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            삭제
          </Button>
        </div>
      </div>
    </article>
  );
}
