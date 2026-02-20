'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Flag } from 'lucide-react';
import { toggleLike } from '@/app/actions/likes';
import { deleteComment, updateComment } from '@/app/actions/comments';
import ReportDialog from '@/components/ui/ReportDialog';
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
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSaving, setIsSaving] = useState(false);

  const handleLike = async () => {
    const result = await toggleLike('comment', comment.id);
    if ('liked' in result) {
      setLikeCount(prev => result.liked ? prev + 1 : prev - 1);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteComment(comment.id);
    setIsDeleting(false);
    if ('error' in result) {
      setIsConfirmingDelete(false);
      alert(result.error);
    } else {
      window.location.reload();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateComment(comment.id, editContent);
    setIsSaving(false);
    if ('error' in result) {
      alert(result.error);
    } else {
      setIsEditing(false);
      window.location.reload();
    }
  };

  return (
    <div className={`${isReply ? 'ml-8 pl-4 border-l-2 border-border/50' : ''}`}>
      <div className="py-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
            <span className="text-[11px] font-medium text-muted-foreground">
              {comment.author_nickname.charAt(0)}
            </span>
          </div>
          <span className="text-sm font-medium text-foreground/85">{comment.author_nickname}</span>
          <span className="text-xs text-muted-foreground" suppressHydrationWarning>{dayjs(comment.created_at).fromNow()}</span>
        </div>
        {isEditing ? (
          <div className="mt-2 pl-8">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full text-sm rounded-xl border border-border px-3 py-2 resize-none bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
            />
            <div className="flex gap-2 mt-1.5">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                {isSaving ? '저장 중...' : '저장'}
              </button>
              <button
                onClick={() => { setIsEditing(false); setEditContent(comment.content); }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap pl-8">{comment.content}</p>
        )}
        <div className="flex items-center gap-3 mt-1.5 pl-8">
          <button onClick={handleLike} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
            <Heart className="h-3 w-3" />
            {likeCount > 0 && <span>{likeCount}</span>}
          </button>
          {!isReply && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle className="h-3 w-3" />
              답글
            </button>
          )}
          <ReportDialog
            targetType="comment"
            targetId={comment.id}
            trigger={
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors">
                <Flag className="h-3 w-3" />
              </button>
            }
          />
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            수정
          </button>
          {!isConfirmingDelete ? (
            <button
              onClick={() => setIsConfirmingDelete(true)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              삭제
            </button>
          ) : (
            <span className="flex items-center gap-1 text-xs">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive hover:text-destructive/80 transition-colors"
              >
                {isDeleting ? '삭제 중' : '확인'}
              </button>
              <span className="text-muted-foreground/30">·</span>
              <button
                onClick={() => setIsConfirmingDelete(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                취소
              </button>
            </span>
          )}
        </div>
      </div>

      {showReplyForm && (
        <div className="ml-8 mb-2">
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
  const totalCount = comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);

  return (
    <div className="mt-8">
      <h3 className="text-[13px] font-semibold text-foreground mb-2">
        댓글 <span className="text-primary font-bold">{totalCount}</span>
      </h3>

      {comments.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">
            아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} />
          ))}
        </div>
      )}
    </div>
  );
}
