import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {SITE_NAME}
          </span>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              이용약관
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              개인정보처리방침
            </Link>
          </div>
        </div>
        <p className="text-xs text-muted-foreground/50 mt-6 text-center">
          본 커뮤니티의 정보는 의학적 조언이 아닙니다. 전문적인 진단과 치료는 반드시 의료 전문가와 상담하세요.
        </p>
      </div>
    </footer>
  );
}
