import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto bg-card/50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-[10px] font-bold">A</span>
            </div>
            <span>&copy; {new Date().getFullYear()} {SITE_NAME}</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              이용약관
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              개인정보처리방침
            </Link>
          </div>
        </div>
        <p className="text-xs text-muted-foreground/60 mt-4 text-center leading-relaxed">
          본 커뮤니티의 정보는 의학적 조언이 아닙니다. 전문적인 진단과 치료는 반드시 의료 전문가와 상담하세요.
        </p>
      </div>
    </footer>
  );
}
