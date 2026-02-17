# ADHD 커뮤니티 UI/기능 점검 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 배포된 ADHD 커뮤니티 사이트(https://adhd-community-gold.vercel.app)의 모든 눈에 보이는 기능이 정상 동작하는지 Playwright로 자동 점검한다.

**Architecture:** Playwright MCP 브라우저로 실제 배포 사이트에 접속하여 페이지별 렌더링, 네비게이션, 인터랙션을 스크린샷 기반으로 검증한다. 문제 발견 시 즉시 기록하고 수정한다.

**Tech Stack:** Playwright MCP (browser automation), 배포 URL 직접 검증

---

### Task 1: 메인 페이지 렌더링 점검

**검증 항목:**
- [ ] 헤더: 로고("ADHD 커뮤니티"), 게시판 네비게이션 5개, 검색 아이콘, 글쓰기 버튼, 다크모드 토글
- [ ] 인기글 섹션: "인기글" 제목, 1시간/6시간/24시간 탭, 게시글 목록
- [ ] 게시판별 최신글: 5개 게시판 각각 최신글 카드 + "더보기" 링크
- [ ] 사이드바: 게시판 목록 (lg 이상에서만 표시)

**Step 1: Playwright로 메인 페이지 접속**

`browser_navigate` → `https://adhd-community-gold.vercel.app`

**Step 2: 스크린샷 촬영 및 스냅샷 확인**

`browser_snapshot`으로 접근성 트리 확인:
- 헤더 내 "ADHD 커뮤니티" 텍스트 존재 여부
- "인기글" heading 존재 여부
- "1시간" / "6시간" / "24시간" 탭 버튼 존재 여부
- 게시판명 5개 (자유게시판, ADHD 정보, 일상 공유, 약물/치료 후기, 부모 게시판) 존재 여부
- 게시글 제목 다수 표시 여부

**Step 3: 인기글 탭 전환**

`browser_click`으로 "6시간" 탭 클릭 → 스냅샷 → 내용 변경 확인
`browser_click`으로 "1시간" 탭 클릭 → 스냅샷 → "해당 기간 인기글이 없습니다." 또는 목록 표시 확인

**Step 4: 결과 기록**

발견된 문제를 리스트로 정리

---

### Task 2: 게시판 페이지 점검 (5개 게시판)

**검증 항목:**
- [ ] 게시판 제목 + 설명 표시
- [ ] "글쓰기" 버튼 존재
- [ ] 정렬 옵션: 최신순, 인기순, 댓글순
- [ ] 게시글 목록: PostCard (제목, 닉네임, 시간, 조회수, 좋아요, 댓글수)
- [ ] HOT/NEW 뱃지 표시
- [ ] 사이드바 현재 게시판 하이라이트
- [ ] 의학적 조언 면책 문구

**Step 1: 자유게시판 접속**

`browser_navigate` → `https://adhd-community-gold.vercel.app/board/free`

**Step 2: 스냅샷으로 구성요소 확인**

`browser_snapshot`:
- "자유게시판" heading
- "ADHD 관련 자유로운 이야기" 설명
- "글쓰기" 버튼
- "최신순" / "인기순" / "댓글순" 정렬 링크
- 게시글 12개 (시드 데이터)
- HOT 뱃지 (like_count >= 10인 글)
- NEW 뱃지 (24시간 이내 글)

**Step 3: 정렬 전환**

`browser_click`으로 "인기순" 클릭 → 스냅샷 → URL에 `?sort=popular` 포함 확인
`browser_click`으로 "댓글순" 클릭 → 스냅샷 → URL에 `?sort=comments` 포함 확인

**Step 4: 나머지 4개 게시판 순회**

각각 `/board/info`, `/board/daily`, `/board/treatment`, `/board/parents` 접속 → 스냅샷 → 글 목록 존재 확인

**Step 5: 결과 기록**

---

### Task 3: 게시글 상세 페이지 점검

**검증 항목:**
- [ ] 뒤로가기 버튼
- [ ] 게시판 Badge
- [ ] 제목, 작성자, 날짜, 조회수, 읽기 시간
- [ ] 본문 내용 (whitespace-pre-wrap)
- [ ] 공감(좋아요) 버튼 + 카운트
- [ ] 신고/삭제 버튼
- [ ] 댓글 목록: 작성자 아바타, 닉네임, 시간, 내용, 좋아요, 답글 버튼
- [ ] 대댓글: 들여쓰기 + 왼쪽 보더
- [ ] 댓글 작성 폼: textarea, 닉네임 input, 등록 버튼

**Step 1: 자유게시판 첫 번째 글 클릭**

`browser_navigate` → `/board/free` → 첫 번째 게시글 클릭

**Step 2: 스냅샷 확인**

- 제목 표시
- 닉네임 + 날짜 + 조회수 표시
- 본문 내용 표시
- "공감" 버튼 + 카운트
- "신고" / "삭제" 버튼
- "댓글 N" heading
- 댓글 목록 (닉네임, 시간, 내용)
- 대댓글 존재 시 들여쓰기 표시

**Step 3: 공감 버튼 클릭 테스트**

`browser_click`으로 "공감" 버튼 클릭 → 카운트 +1 변경 확인
다시 클릭 → 카운트 -1 변경 확인 (토글)

**Step 4: 댓글 작성 폼 확인**

스냅샷에서:
- "댓글을 입력하세요..." placeholder textarea 존재
- "닉네임 (선택)" input 존재
- "등록" 버튼 존재

**Step 5: 결과 기록**

---

### Task 4: 글쓰기 페이지 점검

**검증 항목:**
- [ ] "글 작성" 제목
- [ ] 게시판 select dropdown (5개 게시판)
- [ ] 제목 input + 글자 수 카운터 (0/100)
- [ ] 내용 textarea
- [ ] 닉네임 input (선택)
- [ ] 비밀번호 input (삭제용)
- [ ] 취소/작성하기 버튼

**Step 1: 글쓰기 페이지 접속**

`browser_navigate` → `https://adhd-community-gold.vercel.app/post/write`

**Step 2: 스냅샷 확인**

- "글 작성" heading
- "게시판을 선택하세요" select
- "제목을 입력하세요" input
- "0/100" 글자수 표시
- "내용을 입력하세요" textarea
- "닉네임 (선택)" / "비밀번호 (삭제용)" 2열 input
- "취소" / "작성하기" 버튼

**Step 3: 게시판 드롭다운 확인**

`browser_click`으로 select 열기 → 5개 게시판 옵션 확인

**Step 4: 결과 기록**

---

### Task 5: 검색 기능 점검

**검증 항목:**
- [ ] 헤더 검색 아이콘 클릭 → 검색 입력창 표시
- [ ] 검색 페이지 렌더링
- [ ] 검색 결과 표시 (게시글 목록)
- [ ] 결과 건수 표시

**Step 1: 헤더 검색 아이콘 클릭**

메인 페이지에서 검색 아이콘 클릭 → 검색 input 표시 확인

**Step 2: 검색 실행**

`browser_fill_form` → 검색어 "ADHD" 입력 → Enter
또는 `/search?q=ADHD` 직접 접속

**Step 3: 검색 결과 확인**

스냅샷:
- "ADHD" 검색 결과 N건 표시
- 게시글 목록 표시 (게시판명 포함)

**Step 4: 빈 검색어 / 결과 없는 검색어 테스트**

검색어 "xyzabc123" → "검색 결과가 없습니다." 메시지 확인

**Step 5: 결과 기록**

---

### Task 6: 다크모드 전환 점검

**검증 항목:**
- [ ] 헤더 ThemeToggle 버튼 존재
- [ ] 클릭 시 다크모드 전환
- [ ] 다크모드에서 텍스트, 배경, 카드 색상 변경
- [ ] 다시 클릭 시 라이트모드 복귀

**Step 1: 라이트모드 스크린샷**

`browser_take_screenshot` → 현재 상태 (라이트 모드)

**Step 2: 다크모드 토글 클릭**

ThemeToggle 버튼 클릭 → `browser_take_screenshot` → 배경색 변경 확인

**Step 3: 다시 라이트모드 복귀**

다시 클릭 → 스크린샷 → 원래 상태 확인

**Step 4: 결과 기록**

---

### Task 7: 네비게이션 & 링크 점검

**검증 항목:**
- [ ] 로고 클릭 → 메인 페이지 이동
- [ ] 헤더 게시판 링크 5개 → 각 게시판 이동
- [ ] 게시글 클릭 → 상세 페이지 이동
- [ ] "더보기" 링크 → 게시판 페이지 이동
- [ ] 뒤로가기 버튼 동작
- [ ] 게시판 내 "글쓰기" → `/post/write?board=slug`

**Step 1: 메인에서 게시판 이동**

헤더 "자유게시판" 클릭 → URL `/board/free` 확인

**Step 2: 게시판에서 글 상세 이동**

첫 번째 게시글 클릭 → URL `/post/[id]` 확인

**Step 3: 뒤로가기**

"뒤로" 버튼 클릭 → 게시판 페이지 복귀 확인

**Step 4: 글쓰기 링크**

게시판 내 "글쓰기" 버튼 클릭 → URL `/post/write?board=free` 확인

**Step 5: 메인 복귀**

로고 클릭 → URL `/` 확인

**Step 6: 결과 기록**

---

### Task 8: 발견된 문제 수정 & 최종 검증

**Step 1: 문제 목록 정리**

Task 1~7에서 발견된 모든 문제를 정리

**Step 2: 각 문제 수정**

코드 수정 → 빌드 검증

**Step 3: 수정 후 재검증**

문제가 있었던 페이지 재방문하여 수정 확인

**Step 4: 커밋**

```bash
git add -A
git commit -m "fix: QA 점검 결과 수정"
```
