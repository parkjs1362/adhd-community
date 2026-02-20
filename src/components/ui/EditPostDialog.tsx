'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updatePost } from '@/app/actions/posts';
import { useRouter } from 'next/navigation';

interface EditPostDialogProps {
  postId: string;
  currentTitle: string;
  currentContent: string;
  trigger: React.ReactNode;
}

export default function EditPostDialog({ postId, currentTitle, currentContent, trigger }: EditPostDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [content, setContent] = useState(currentContent);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setTitle(currentTitle);
      setContent(currentContent);
      setPassword('');
      setStatus('idle');
      setErrorMsg('');
    }
    setOpen(val);
  };

  const handleSave = async () => {
    if (!password.trim()) return;
    setStatus('loading');
    const result = await updatePost(postId, title, content, password);
    if ('error' in result) {
      setStatus('error');
      setErrorMsg(result.error ?? '수정에 실패했습니다.');
    } else {
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>게시글 수정</DialogTitle>
          <DialogDescription>
            내용을 수정한 후 작성 시 입력한 비밀번호를 입력해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-2">
          <Input
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-muted/40 border-0 rounded-xl"
          />
          <textarea
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full text-sm rounded-xl border-0 bg-muted/40 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            rows={8}
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="bg-muted/40 border-0 rounded-xl"
            autoFocus
          />
          {status === 'error' && (
            <p className="text-xs text-destructive">{errorMsg}</p>
          )}
        </div>

        <div className="flex gap-2 justify-end mt-2">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            onClick={() => handleOpenChange(false)}
          >
            취소
          </Button>
          <Button
            size="sm"
            className="rounded-full"
            onClick={handleSave}
            disabled={!password.trim() || !title.trim() || !content.trim() || status === 'loading'}
          >
            {status === 'loading' ? '저장 중...' : '저장'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
