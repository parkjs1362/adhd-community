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
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">
          {error}
        </div>
      )}

      {/* 게시판 선택 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">게시판</label>
        <select
          name="board"
          defaultValue={defaultBoard || ''}
          required
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]/50"
        >
          <option value="" disabled>게시판을 선택하세요</option>
          {BOARDS.map((board) => (
            <option key={board.slug} value={board.slug}>
              {board.name}
            </option>
          ))}
        </select>
      </div>

      {/* 제목 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          제목
          <span className={`ml-2 text-xs ${title.length > MAX_TITLE_LENGTH ? 'text-red-500' : 'text-slate-400'}`}>
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
          required
        />
      </div>

      {/* 본문 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">내용</label>
        <Textarea
          name="content"
          rows={12}
          placeholder="내용을 입력하세요"
          className="resize-y min-h-[200px]"
          required
        />
      </div>

      {/* 닉네임 & 비밀번호 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">닉네임 (선택)</label>
          <Input name="nickname" placeholder="익명" maxLength={20} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">비밀번호 (삭제용)</label>
          <Input name="password" type="password" placeholder="4자리 이상" minLength={4} />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          취소
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#4A90D9] hover:bg-[#3A7BC8] text-white"
        >
          {isSubmitting ? '작성 중...' : '작성하기'}
        </Button>
      </div>
    </form>
  );
}
