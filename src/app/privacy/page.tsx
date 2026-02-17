import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">개인정보처리방침</h1>
      <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-slate-700">1. 수집하는 개인정보</h2>
          <p>본 커뮤니티는 회원가입을 요구하지 않으며, 최소한의 정보만 처리합니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>IP 주소</strong>: 게시글/댓글 작성 시 해시(SHA-256) 처리하여 저장합니다. 원본 IP는 저장하지 않습니다.</li>
            <li><strong>닉네임</strong>: 사용자가 자발적으로 입력한 닉네임 (기본값: 익명)</li>
            <li><strong>쿠키</strong>: 서비스 이용에 필요한 세션 쿠키를 사용합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-700">2. 개인정보의 처리 목적</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>게시글/댓글 작성자 식별 (중복 방지, 신고 처리)</li>
            <li>서비스 악용 방지 (도배, 스팸 차단)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-700">3. 개인정보의 보관 기간</h2>
          <p>해시 처리된 IP 정보는 게시글/댓글이 존재하는 동안 보관되며, 삭제 시 함께 파기됩니다.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-700">4. 광고</h2>
          <p>본 커뮤니티는 Google AdSense를 통한 광고를 게재합니다. Google의 개인정보 처리에 대해서는 Google 개인정보처리방침을 참고하세요.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-700">5. 문의</h2>
          <p>개인정보 관련 문의사항은 사이트 관리자에게 연락해주세요.</p>
        </section>

        <p className="text-xs text-slate-400 mt-8">
          시행일: 2026년 2월 17일
        </p>
      </div>
    </div>
  );
}
