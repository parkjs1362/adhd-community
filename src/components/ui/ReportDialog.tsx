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
import { reportContent } from '@/app/actions/reports';

const CATEGORIES = ['스팸', '욕설·혐오', '음란물', '기타'] as const;

interface ReportDialogProps {
  targetType: 'post' | 'comment';
  targetId: string;
  trigger: React.ReactNode;
}

export default function ReportDialog({ targetType, targetId, trigger }: ReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    if (!selected) return;
    setStatus('loading');
    const result = await reportContent(targetType, targetId, selected);
    if ('error' in result) {
      setStatus('error');
      setErrorMsg(result.error ?? '오류가 발생했습니다.');
    } else {
      setStatus('success');
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setSelected('');
      setStatus('idle');
      setErrorMsg('');
    }
    setOpen(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>신고하기</DialogTitle>
          <DialogDescription>신고 사유를 선택해주세요.</DialogDescription>
        </DialogHeader>

        {status === 'success' ? (
          <div className="py-4 text-center">
            <p className="text-sm text-foreground font-medium">신고가 접수되었습니다.</p>
            <p className="text-xs text-muted-foreground mt-1">검토 후 조치하겠습니다.</p>
            <Button
              size="sm"
              variant="outline"
              className="mt-4 rounded-full"
              onClick={() => handleOpenChange(false)}
            >
              닫기
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2 my-2">
              {CATEGORIES.map((cat) => (
                <label
                  key={cat}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer border transition-colors ${
                    selected === cat
                      ? 'border-primary bg-primary/5'
                      : 'border-border/50 hover:bg-muted/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="report-category"
                    value={cat}
                    checked={selected === cat}
                    onChange={() => setSelected(cat)}
                    className="accent-primary"
                  />
                  <span className="text-sm text-foreground">{cat}</span>
                </label>
              ))}
            </div>

            {status === 'error' && (
              <p className="text-xs text-destructive">{errorMsg}</p>
            )}

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
                onClick={handleSubmit}
                disabled={!selected || status === 'loading'}
              >
                {status === 'loading' ? '처리 중...' : '신고'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
