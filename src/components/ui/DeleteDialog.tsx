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
import { deletePost } from '@/app/actions/posts';
import { useRouter } from 'next/navigation';

interface DeleteDialogProps {
  postId: string;
  boardSlug?: string;
  trigger: React.ReactNode;
}

export default function DeleteDialog({ postId, boardSlug, trigger }: DeleteDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setPassword('');
      setStatus('idle');
      setErrorMsg('');
    }
    setOpen(val);
  };

  const handleDelete = async () => {
    if (!password.trim()) return;
    setStatus('loading');
    const result = await deletePost(postId, password);
    if ('error' in result) {
      setStatus('error');
      setErrorMsg(result.error ?? '삭제에 실패했습니다.');
    } else {
      setOpen(false);
      router.push(boardSlug ? `/board/${boardSlug}` : '/');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>게시글 삭제</DialogTitle>
          <DialogDescription>
            작성 시 입력한 비밀번호를 입력하면 삭제됩니다. 삭제 후 복구할 수 없습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2">
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleDelete()}
            className="bg-muted/40 border-0 rounded-xl"
            autoFocus
          />
          {status === 'error' && (
            <p className="text-xs text-destructive mt-2">{errorMsg}</p>
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
            className="rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            onClick={handleDelete}
            disabled={!password.trim() || status === 'loading'}
          >
            {status === 'loading' ? '삭제 중...' : '삭제'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
