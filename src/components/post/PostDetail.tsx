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

  // 읽기 시간 계산
  const readingTime = Math.max(1, Math.ceil(post.content.length / 500));

  return (
    <article>
      {/* 헤더 */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          뒤로
        </button>

        {post.board && (
          <Badge variant="secondary" className="mb-2 text-xs">
            {post.board.name}
          </Badge>
        )}

        <h1 className="text-xl font-bold text-slate-900 leading-tight mb-2">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-slate-400">
          <span className="font-medium text-slate-600">{post.author_nickname}</span>
          <span>{dayjs(post.created_at).format('YYYY.MM.DD HH:mm')}</span>
          <span>조회 {post.view_count}</span>
          <Badge variant="outline" className="text-[10px] text-slate-400">
            약 {readingTime}분
          </Badge>
        </div>
      </div>

      {/* 본문 */}
      <div className="prose prose-slate max-w-none text-[15px] leading-[1.7] whitespace-pre-wrap break-words mb-8">
        {post.content}
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center justify-between py-4 border-t border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Button
            variant={liked ? 'default' : 'outline'}
            size="sm"
            onClick={handleLike}
            className={liked ? 'bg-[#4A90D9] hover:bg-[#3A7BC8]' : ''}
          >
            <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-current' : ''}`} />
            공감 {likeCount}
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReport}
            disabled={isReporting}
            className="text-slate-400 hover:text-red-500"
          >
            <Flag className="h-4 w-4 mr-1" />
            신고
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-slate-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            삭제
          </Button>
        </div>
      </div>
    </article>
  );
}
