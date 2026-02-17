import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center animate-fade-in-up">
      <div className="text-7xl font-bold text-border mb-4">404</div>
      <p className="text-lg text-muted-foreground mb-8">페이지를 찾을 수 없습니다.</p>
      <Link href="/">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
          홈으로 돌아가기
        </Button>
      </Link>
    </div>
  );
}
