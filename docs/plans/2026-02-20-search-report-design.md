# 검색 페이지네이션 + 신고 Dialog UI 설계

## 날짜
2026-02-20

## 배경
- 검색/신고 기능의 서버 로직은 이미 구현되어 있음
- 신고: `prompt()`/`alert()` 브라우저 기본 대화상자 사용 → UX 저하
- 검색: 결과 페이지네이션 없음

## 설계

### 1. ReportDialog 공통 컴포넌트

**파일:** `src/components/ui/ReportDialog.tsx`

- Radix UI Dialog 기반 (기존 dialog.tsx 재사용)
- 신고 카테고리 4개 라디오: 스팸 / 욕설·혐오 / 음란물 / 기타
- 제출 후 성공/에러 인라인 피드백 (alert 대신)
- props: `targetType`, `targetId`, `trigger` (슬롯)

### 2. PostDetail.tsx 수정

- `prompt()` / `alert()` 제거
- `<ReportDialog>` 컴포넌트로 교체

### 3. CommentList.tsx 수정

- `prompt()` / `alert()` 제거
- 각 댓글 신고 버튼을 `<ReportDialog>` 트리거로 교체

### 4. search/page.tsx 수정

- URL `?page=N` 파라미터로 페이지 제어
- `searchPosts()` 이미 page 파라미터 지원
- 이전/다음 버튼 + "N건 / X페이지" 표시
- 한 페이지 20건 (기존 perPage 유지)

## 수정 파일
1. `src/components/ui/ReportDialog.tsx` (신규)
2. `src/components/post/PostDetail.tsx`
3. `src/components/comment/CommentList.tsx`
4. `src/app/search/page.tsx`
