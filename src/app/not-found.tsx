import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center animate-fade-in">
      <div className="text-8xl font-bold text-muted-foreground/20 mb-4 tracking-tighter">404</div>
      <p className="text-lg text-muted-foreground mb-8">페이지를 찾을 수 없습니다.</p>
      <Link href="/">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6">
          홈으로 돌아가기
        </Button>
      </Link>
    </div>
  );
}
