import Link from 'next/link';
import { getAdminStats } from '@/app/actions/admin';
import AdminLogoutButton from './AdminLogoutButton';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const stats = await getAdminStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 관리자 상단바 */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
              <span>🧠</span>
              <span>관리자</span>
            </Link>
            <nav className="flex items-center gap-1">
              <Link
                href="/admin"
                className="px-3 py-1.5 text-sm rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                대시보드
              </Link>
              <Link
                href="/admin/reports"
                className="px-3 py-1.5 text-sm rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
              >
                신고
                {stats.pendingReports > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {stats.pendingReports}
                  </span>
                )}
              </Link>
              <Link
                href="/admin/posts"
                className="px-3 py-1.5 text-sm rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                게시글
              </Link>
            </nav>
          </div>
          <AdminLogoutButton />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
