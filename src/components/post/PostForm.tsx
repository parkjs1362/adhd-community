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
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-[13px] font-semibold text-foreground mb-1.5">게시판</label>
        <select
          name="board"
          defaultValue={defaultBoard || ''}
          required
          className="w-full rounded-2xl border border-border/60 bg-muted/30 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all duration-200"
        >
          <option value="" disabled>게시판을 선택하세요</option>
          {BOARDS.map((board) => (
            <option key={board.slug} value={board.slug}>
              {board.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-foreground mb-1.5">
          제목
          <span className={`ml-2 text-xs font-normal ${title.length > MAX_TITLE_LENGTH ? 'text-destructive' : 'text-muted-foreground'}`}>
            {title.length}/{MAX_TITLE_LENGTH}
          </span>
        </label>
        <Input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={MAX_TITLE_LENGTH}
          placeholder="제목을 입력하세요"
          className="bg-muted/30 border-border/60 rounded-2xl focus:border-primary/30 transition-colors duration-200"
          required
        />
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-foreground mb-1.5">내용</label>
        <Textarea
          name="content"
          rows={12}
          placeholder="내용을 입력하세요"
          className="resize-y min-h-[200px] bg-muted/40 border-border rounded-2xl"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[13px] font-semibold text-foreground mb-1.5">닉네임 (선택)</label>
          <Input name="nickname" placeholder="익명" maxLength={20} className="bg-muted/30 border-border/60 rounded-2xl focus:border-primary/30 transition-colors duration-200" />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-foreground mb-1.5">비밀번호 (삭제용)</label>
          <Input name="password" type="password" placeholder="4자리 이상" minLength={4} className="bg-muted/30 border-border/60 rounded-2xl focus:border-primary/30 transition-colors duration-200" />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="rounded-full text-muted-foreground"
        >
          취소
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
        >
          {isSubmitting ? '작성 중...' : '작성하기'}
        </Button>
      </div>
    </form>
  );
}
