import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} {SITE_NAME}. 모든 게시물의 저작권은 작성자에게 있습니다.
          </div>
          <div className="flex gap-4 text-sm text-slate-500">
            <Link href="/terms" className="hover:text-slate-700">
              이용약관
            </Link>
            <Link href="/privacy" className="hover:text-slate-700">
              개인정보처리방침
            </Link>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-4 text-center">
          본 커뮤니티의 정보는 의학적 조언이 아닙니다. 전문적인 진단과 치료는 반드시 의료 전문가와 상담하세요.
        </p>
      </div>
    </footer>
  );
}
