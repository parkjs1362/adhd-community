'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { createComment } from '@/app/actions/comments';

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
  placeholder?: string;
  compact?: boolean;
}

export default function CommentForm({ postId, parentId, onSuccess, placeholder = '댓글을 입력하세요...', compact = false }: CommentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError('');

    formData.set('postId', postId);
    if (parentId) formData.set('parentId', parentId);

    const result = await createComment(formData);

    if ('error' in result) {
      setError(result.error || '오류가 발생했습니다.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    router.refresh();
    onSuccess?.();
  };

  return (
    <form action={handleSubmit} className={`${compact ? '' : 'bg-secondary/50 rounded-xl p-4 mt-4 border border-border/50'}`}>
      {error && (
        <p className="text-xs text-destructive mb-2">{error}</p>
      )}
      <Textarea
        name="content"
        rows={compact ? 2 : 3}
        placeholder={placeholder}
        className="mb-2 bg-card border-border"
        required
      />
      <div className="flex items-center justify-between">
        <Input
          name="nickname"
          placeholder="닉네임 (선택)"
          className="w-32 h-8 text-sm bg-card border-border"
          maxLength={20}
        />
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
        >
          {isSubmitting ? '작성 중...' : '등록'}
        </Button>
      </div>
    </form>
  );
}
