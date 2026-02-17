import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-slate-200 mb-4">404</h1>
      <p className="text-lg text-slate-500 mb-6">페이지를 찾을 수 없습니다.</p>
      <Link href="/">
        <Button className="bg-[#4A90D9] hover:bg-[#3A7BC8] text-white">
          홈으로 돌아가기
        </Button>
      </Link>
    </div>
  );
}
