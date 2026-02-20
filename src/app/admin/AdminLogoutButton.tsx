'use client';

import { useRouter } from 'next/navigation';
import { adminLogout } from '@/app/actions/admin';

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await adminLogout();
    router.push('/admin/login');
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
    >
      로그아웃
    </button>
  );
}
