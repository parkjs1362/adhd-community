import ReportsClient from './ReportsClient';
import { getReports } from '@/app/actions/admin';

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminReportsPage({ searchParams }: Props) {
  const params = await searchParams;
  const status = (params.status as 'pending' | 'reviewed' | 'dismissed') || 'pending';
  const reports = await getReports(status);

  return <ReportsClient reports={reports} currentStatus={status} />;
}
