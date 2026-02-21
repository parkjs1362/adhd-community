'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminHidePost, adminRestorePost } from '@/app/actions/admin';

interface Post {
  id: string;
  title: string;
  board_id: string;
  boardName: string;
  created_at: string;
  view_count: number;
  is_hidden: boolean;
}

interface Props {
  posts: Post[];
  total: number;
  page: number;
  showHidden: boolean;
}

const PAGE_SIZE = 20;

export default function PostsClient({ posts, total, page, showHidden }: Props) {
  const router = useRouter();
  const totalPages = Math.ceil(total / PAGE_SIZE);

  function updateParams(params: Record<string, string>) {
    const sp = new URLSearchParams();
    if (params.page) sp.set('page', params.page);
    if (showHidden || params.showHidden === 'true') sp.set('showHidden', 'true');
    if (params.showHidden === 'false') sp.delete('showHidden');
    router.push(`/admin/posts?${sp.toString()}`);
  }

  async function handleHide(id: string) {
    await adminHidePost(id);
    router.refresh();
  }

  async function handleRestore(id: string) {
    await adminRestorePost(id);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">게시글 관리</h1>
        <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={showHidden}
            onChange={(e) =>
              router.push(
                `/admin/posts?page=1${e.target.checked ? '&showHidden=true' : ''}`
              )
            }
            className="rounded border-gray-300 dark:border-gray-600"
          />
          숨김 게시글 포함
        </label>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">제목</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400 hidden md:table-cell">게시판</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400 hidden sm:table-cell">작성일</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400 hidden md:table-cell">조회</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600 dark:text-gray-400">상태</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400 dark:text-gray-500">
                  게시글이 없습니다.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3">
                    <a
                      href={`/post/${post.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 hover:underline line-clamp-1"
                    >
                      {post.title}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">
                    {post.boardName}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                    {new Date(post.created_at).toLocaleDateString('ko-KR', {
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-right hidden md:table-cell">
                    {(post.view_count ?? 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {post.is_hidden ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-medium">
                        숨김 🔴
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-medium">
                        공개
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {post.is_hidden ? (
                      <button
                        onClick={() => handleRestore(post.id)}
                        className="text-xs px-2.5 py-1 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                      >
                        복원
                      </button>
                    ) : (
                      <button
                        onClick={() => handleHide(post.id)}
                        className="text-xs px-2.5 py-1 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                      >
                        숨김
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            총 {total.toLocaleString()}개 · {page}/{totalPages} 페이지
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => updateParams({ page: String(page - 1) })}
              disabled={page <= 1}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              이전
            </button>
            <button
              onClick={() => updateParams({ page: String(page + 1) })}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
