'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminHidePost, adminHideComment, updateReportStatus } from '@/app/actions/admin';

type ReportStatus = 'pending' | 'reviewed' | 'dismissed';

interface Report {
  id: string;
  target_type: 'post' | 'comment';
  target_id: string;
  reason: string;
  created_at: string;
  status: string;
  target: {
    id: string;
    title?: string;
    content: string;
    is_hidden: boolean;
    board_id?: string;
    post_id?: string;
  } | null;
}

interface Props {
  reports: Report[];
  currentStatus: ReportStatus;
}

const statusLabels: Record<ReportStatus, string> = {
  pending: '대기중',
  reviewed: '처리됨',
  dismissed: '무시됨',
};

export default function ReportsClient({ reports, currentStatus }: Props) {
  const router = useRouter();

  async function handleHide(report: Report) {
    if (report.target_type === 'post') {
      await adminHidePost(report.target_id);
    } else {
      await adminHideComment(report.target_id);
    }
    router.refresh();
  }

  async function handleDismiss(id: string) {
    await updateReportStatus(id, 'dismissed');
    router.refresh();
  }

  const tabs: ReportStatus[] = ['pending', 'reviewed', 'dismissed'];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">신고 관리</h1>

      {/* 탭 */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <Link
            key={tab}
            href={`/admin/reports?status=${tab}`}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              currentStatus === tab
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {statusLabels[tab]}
          </Link>
        ))}
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          신고 내역이 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    report.target_type === 'post'
                      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                      : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                  }`}>
                    {report.target_type === 'post' ? '게시글' : '댓글'}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                    {report.reason}
                  </span>
                  {report.target?.is_hidden && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">
                      숨김처리됨
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                  {new Date(report.created_at).toLocaleDateString('ko-KR', {
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {report.target ? (
                <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4 line-clamp-2">
                  {report.target_type === 'post' && report.target.title
                    ? `${report.target.title}: ${report.target.content}`
                    : report.target.content}
                </div>
              ) : (
                <div className="text-sm text-gray-400 italic mb-4">
                  원문이 삭제되었거나 존재하지 않습니다.
                </div>
              )}

              <div className="flex items-center gap-2">
                {report.target && (
                  <a
                    href={
                      report.target_type === 'post'
                        ? `/post/${report.target_id}`
                        : `/post/${report.target.post_id}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    원문 보기↗
                  </a>
                )}
                {currentStatus === 'pending' && (
                  <>
                    <button
                      onClick={() => handleHide(report)}
                      disabled={report.target?.is_hidden}
                      className="ml-auto text-sm px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      숨김처리
                    </button>
                    <button
                      onClick={() => handleDismiss(report.id)}
                      className="text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      무시
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
