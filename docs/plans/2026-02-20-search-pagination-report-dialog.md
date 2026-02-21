# 검색 페이지네이션 + 신고 Dialog UI 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** `prompt()`/`alert()` 기반 신고 UI를 Dialog 컴포넌트로 교체하고, 검색 결과 페이지네이션을 추가한다.

**Architecture:** 공통 `ReportDialog` 컴포넌트를 신규 생성하여 PostDetail과 CommentList 양쪽에서 재사용. 검색은 기존 `searchPosts()` 액션의 page 파라미터를 활용해 URL `?page=N` 방식으로 페이지네이션 구현.

**Tech Stack:** Next.js 14 (App Router), React, Tailwind CSS, Radix UI Dialog

---

### Task 1: ReportDialog 공통 컴포넌트 생성

**Files:**
- Create: `src/components/ui/ReportDialog.tsx`

**Step 1: 파일 생성**

```tsx
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
      setErrorMsg(result.error);
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
              onClick={() => setOpen(false)}
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
                onClick={() => setOpen(false)}
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
```

**Step 2: 빌드 확인**

```bash
cd ~/Dropbox/code/adhd-community && npm run build 2>&1 | tail -20
```

Expected: 에러 없이 완료 (또는 PostDetail/CommentList는 아직 미수정이므로 해당 파일만 컴파일 OK)

**Step 3: 커밋**

```bash
git add src/components/ui/ReportDialog.tsx
git commit -m "feat: ReportDialog 공통 컴포넌트 추가 (카테고리 선택 방식)"
```

---

### Task 2: PostDetail.tsx — ReportDialog 교체

**Files:**
- Modify: `src/components/post/PostDetail.tsx`

**Step 1: import 변경**

기존:
```tsx
import { Heart, Flag, Trash2, ChevronLeft } from 'lucide-react';
```

변경 후 (Flag 제거):
```tsx
import { Heart, Flag, Trash2, ChevronLeft } from 'lucide-react';
import ReportDialog from '@/components/ui/ReportDialog';
```

(Flag는 ReportDialog 트리거 내부에서 계속 사용하므로 유지)

**Step 2: isReporting 상태 및 handleReport 제거**

제거할 코드:
```tsx
const [isReporting, setIsReporting] = useState(false);
```

```tsx
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
```

또한 `reportContent` import도 제거:
```tsx
import { reportContent } from '@/app/actions/reports';
```

**Step 3: 신고 버튼을 ReportDialog로 교체**

기존:
```tsx
<Button
  variant="ghost"
  size="sm"
  onClick={handleReport}
  disabled={isReporting}
  className="text-muted-foreground hover:text-destructive rounded-full"
>
  <Flag className="h-4 w-4 mr-1" />
  신고
</Button>
```

교체:
```tsx
<ReportDialog
  targetType="post"
  targetId={post.id}
  trigger={
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground hover:text-destructive rounded-full"
    >
      <Flag className="h-4 w-4 mr-1" />
      신고
    </Button>
  }
/>
```

**Step 4: 빌드 확인**

```bash
cd ~/Dropbox/code/adhd-community && npm run build 2>&1 | tail -20
```

Expected: 에러 없음

**Step 5: 커밋**

```bash
git add src/components/post/PostDetail.tsx
git commit -m "feat: 게시글 신고 UI를 ReportDialog로 교체"
```

---

### Task 3: CommentList.tsx — ReportDialog 교체

**Files:**
- Modify: `src/components/comment/CommentList.tsx`

**Step 1: import 추가 및 reportContent import 제거**

추가:
```tsx
import ReportDialog from '@/components/ui/ReportDialog';
```

제거:
```tsx
import { reportContent } from '@/app/actions/reports';
```

**Step 2: handleReport 함수 제거**

제거:
```tsx
const handleReport = async () => {
  const reason = prompt('신고 사유를 입력해주세요:');
  if (!reason) return;
  const result = await reportContent('comment', comment.id, reason);
  if ('error' in result) alert(result.error);
  else alert('신고가 접수되었습니다.');
};
```

**Step 3: 신고 버튼을 ReportDialog로 교체**

기존:
```tsx
<button onClick={handleReport} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors">
  <Flag className="h-3 w-3" />
</button>
```

교체:
```tsx
<ReportDialog
  targetType="comment"
  targetId={comment.id}
  trigger={
    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors">
      <Flag className="h-3 w-3" />
    </button>
  }
/>
```

**Step 4: 빌드 확인**

```bash
cd ~/Dropbox/code/adhd-community && npm run build 2>&1 | tail -20
```

Expected: 에러 없음

**Step 5: 커밋**

```bash
git add src/components/comment/CommentList.tsx
git commit -m "feat: 댓글 신고 UI를 ReportDialog로 교체"
```

---

### Task 4: 검색 페이지 페이지네이션 추가

**Files:**
- Modify: `src/app/search/page.tsx`

**Step 1: 전체 파일 교체**

```tsx
import { searchPosts } from '@/app/actions/search';
import PostList from '@/components/post/PostList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export const metadata: Metadata = {
  title: '검색',
};

const PER_PAGE = 20;

export default async function SearchPage({ searchParams }: PageProps) {
  const { q, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || '1', 10));

  const result = q ? await searchPosts(q, undefined, page) : null;
  const totalPages = result ? Math.ceil(result.total / PER_PAGE) : 1;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-5 tracking-tight">검색</h1>

      <form action="/search" method="get" className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={q}
            placeholder="검색어를 입력하세요..."
            className="pl-9 bg-muted/40 border-0 rounded-2xl"
            autoFocus
          />
        </div>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5">
          검색
        </Button>
      </form>

      {q && result && (
        <div className="animate-fade-in">
          <p className="text-sm text-muted-foreground mb-3">
            &quot;{q}&quot; 검색 결과{' '}
            <span className="text-primary font-medium">{result.total}</span>건
            {totalPages > 1 && (
              <span className="ml-2 text-muted-foreground/60">
                ({page} / {totalPages} 페이지)
              </span>
            )}
          </p>

          <PostList
            posts={result.posts}
            showBoard
            emptyMessage="검색 결과가 없습니다."
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {page > 1 ? (
                <Link
                  href={`/search?q=${encodeURIComponent(q)}&page=${page - 1}`}
                  className="flex items-center gap-1 px-4 py-2 text-sm rounded-full border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  이전
                </Link>
              ) : (
                <span className="flex items-center gap-1 px-4 py-2 text-sm rounded-full text-muted-foreground/30 cursor-not-allowed">
                  <ChevronLeft className="h-4 w-4" />
                  이전
                </span>
              )}

              <span className="text-sm text-muted-foreground px-2">
                {page} / {totalPages}
              </span>

              {page < totalPages ? (
                <Link
                  href={`/search?q=${encodeURIComponent(q)}&page=${page + 1}`}
                  className="flex items-center gap-1 px-4 py-2 text-sm rounded-full border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                >
                  다음
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="flex items-center gap-1 px-4 py-2 text-sm rounded-full text-muted-foreground/30 cursor-not-allowed">
                  다음
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

**Step 2: 빌드 확인**

```bash
cd ~/Dropbox/code/adhd-community && npm run build 2>&1 | tail -20
```

Expected: 에러 없음

**Step 3: 커밋**

```bash
git add src/app/search/page.tsx
git commit -m "feat: 검색 결과 페이지네이션 추가"
```

---

### Task 5: 최종 확인 및 배포

**Step 1: 로컬에서 동작 확인**

```bash
cd ~/Dropbox/code/adhd-community && npm run dev
```

확인 항목:
- `/search?q=ADHD` → 결과 + 페이지네이션 렌더링
- 게시글 상세 → 신고 버튼 클릭 → Dialog 열림 → 카테고리 선택 → 신고 제출
- 댓글 신고 버튼 → 같은 Dialog 동작

**Step 2: 프로덕션 배포**

```bash
cd ~/Dropbox/code/adhd-community && git push origin main
```

Vercel 자동 배포 확인:
```bash
vercel ls --project adhd-community 2>/dev/null || echo "vercel CLI로 직접 확인"
```

**Step 3: Obsidian 노트 업데이트**

노트 경로: `01-Projects/00-진행중/Side Project/🧠 ADHD Community.md`

업데이트 내용:
- 진행률: 55% → 70%
- 버전: v0.2.0 → v0.3.0
- 체크리스트 갱신:
  - [x] 검색 기능 (페이지네이션 포함)
  - [x] 신고 기능 UI (Dialog 방식)
