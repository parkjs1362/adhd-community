import Link from 'next/link';
import { getAdminStats } from '@/app/actions/admin';

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  const cards = [
    { label: '전체 게시글', value: stats.totalPosts.toLocaleString(), icon: '📝', highlight: false },
    { label: '전체 댓글', value: stats.totalComments.toLocaleString(), icon: '💬', highlight: false },
    { label: '대기 신고', value: stats.pendingReports.toLocaleString(), icon: '🚨', highlight: stats.pendingReports > 0 },
    { label: '오늘 게시글', value: stats.todayPosts.toLocaleString(), icon: '📅', highlight: false },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">대시보드</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`bg-white dark:bg-gray-800 rounded-xl border p-5 ${
              card.highlight
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <div className={`text-3xl font-bold mb-1 ${
              card.highlight ? 'text-red-500' : 'text-gray-900 dark:text-gray-100'
            }`}>
              {card.value}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{card.label}</div>
          </div>
        ))}
      </div>

      {stats.pendingReports > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <span>🚨</span>
            <span className="font-medium">
              처리되지 않은 신고가 {stats.pendingReports}건 있습니다.
            </span>
          </div>
          <Link
            href="/admin/reports"
            className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
          >
            신고 확인하기 →
          </Link>
        </div>
      )}
    </div>
  );
}
