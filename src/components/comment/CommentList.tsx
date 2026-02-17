'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toggleLike } from '@/app/actions/likes';
import { reportContent } from '@/app/actions/reports';
import CommentForm from './CommentForm';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);
dayjs.locale('ko');

interface Comment {
  id: string;
  content: string;
  author_nickname: string;
  like_count: number;
  created_at: string;
  replies?: Comment[];
}

interface CommentListProps {
  postId: string;
  comments: Comment[];
}

function CommentItem({ comment, postId, isReply = false }: { comment: Comment; postId: string; isReply?: boolean }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.like_count);

  const handleLike = async () => {
    const result = await toggleLike('comment', comment.id);
    if ('liked' in result) {
      setLikeCount(prev => result.liked ? prev + 1 : prev - 1);
    }
  };

  const handleReport = async () => {
    const reason = prompt('신고 사유를 입력해주세요:');
    if (!reason) return;
    const result = await reportContent('comment', comment.id, reason);
    if ('error' in result) alert(result.error);
    else alert('신고가 접수되었습니다.');
  };

  return (
    <div className={`${isReply ? 'ml-8 pl-4 border-l-2 border-slate-100' : ''}`}>
      <div className="py-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-slate-700">{comment.author_nickname}</span>
          <span className="text-xs text-slate-400">{dayjs(comment.created_at).fromNow()}</span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <button onClick={handleLike} className="flex items-center gap-0.5 text-xs text-slate-400 hover:text-[#4A90D9]">
            <Heart className="h-3 w-3" />
            {likeCount > 0 && likeCount}
          </button>
          {!isReply && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-0.5 text-xs text-slate-400 hover:text-[#4A90D9]"
            >
              <MessageCircle className="h-3 w-3" />
              답글
            </button>
          )}
          <button onClick={handleReport} className="flex items-center gap-0.5 text-xs text-slate-400 hover:text-red-500">
            <Flag className="h-3 w-3" />
          </button>
        </div>
      </div>

      {showReplyForm && (
        <div className="ml-4 mb-2">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            onSuccess={() => setShowReplyForm(false)}
            placeholder="답글을 입력하세요..."
            compact
          />
        </div>
      )}

      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} postId={postId} isReply />
      ))}
    </div>
  );
}

export default function CommentList({ postId, comments }: CommentListProps) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">
        댓글 {comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)}개
      </h3>

      {comments.length === 0 ? (
        <p className="text-sm text-slate-400 py-8 text-center">
          아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
        </p>
      ) : (
        <div className="divide-y divide-slate-100">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} />
          ))}
        </div>
      )}
    </div>
  );
}
