'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createPost } from '@/app/actions/posts';
import { BOARDS, MAX_TITLE_LENGTH, RECOMMENDED_TITLE_LENGTH } from '@/lib/constants';

interface PostFormProps {
  defaultBoard?: string;
}

export default function PostForm({ defaultBoard }: PostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError('');

    const result = await createPost(formData);

    if ('error' in result) {
      setError(result.error || '오류가 발생했습니다.');
      setIsSubmitting(false);
      return;
    }

    if (result.data) {
      router.push(`/post/${result.data.id}`);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      {/* Board Select */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">게시판</label>
        <select
          name="board"
          defaultValue={defaultBoard || ''}
          required
          className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all"
        >
          <option value="" disabled>게시판을 선택하세요</option>
          {BOARDS.map((board) => (
            <option key={board.slug} value={board.slug}>
              {board.name}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          제목
          <span className={`ml-2 text-xs font-normal ${title.length > MAX_TITLE_LENGTH ? 'text-destructive' : 'text-muted-foreground'}`}>
            {title.length}/{MAX_TITLE_LENGTH}
            {title.length > 0 && title.length <= RECOMMENDED_TITLE_LENGTH && ' ✓'}
          </span>
        </label>
        <Input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={MAX_TITLE_LENGTH}
          placeholder="제목을 입력하세요 (50자 권장)"
          className="bg-card"
          required
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">내용</label>
        <Textarea
          name="content"
          rows={12}
          placeholder="내용을 입력하세요"
          className="resize-y min-h-[200px] bg-card"
          required
        />
      </div>

      {/* Nickname & Password */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">닉네임 (선택)</label>
          <Input name="nickname" placeholder="익명" maxLength={20} className="bg-card" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">비밀번호 (삭제용)</label>
          <Input name="password" type="password" placeholder="4자리 이상" minLength={4} className="bg-card" />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="rounded-lg border-border text-muted-foreground"
        >
          취소
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
        >
          {isSubmitting ? '작성 중...' : '작성하기'}
        </Button>
      </div>
    </form>
  );
}
