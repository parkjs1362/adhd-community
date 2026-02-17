import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">이용약관</h1>
      <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-slate-700">제1조 (목적)</h2>
          <p>본 약관은 ADHD 커뮤니티(이하 &quot;서비스&quot;)의 이용에 관한 기본적인 사항을 규정함을 목적으로 합니다.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-700">제2조 (서비스의 이용)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>본 서비스는 회원가입 없이 누구나 이용할 수 있습니다.</li>
            <li>게시글 및 댓글 작성 시 IP 주소가 해시 처리되어 저장됩니다.</li>
            <li>작성한 글의 수정/삭제를 위해 비밀번호를 설정할 수 있습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-700">제3조 (금지 행위)</h2>
          <p>다음 행위는 금지되며, 위반 시 게시물이 삭제될 수 있습니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>타인을 비방하거나 명예를 훼손하는 행위</li>
            <li>허위 의학 정보를 유포하는 행위</li>
            <li>특정 약물이나 치료법을 무분별하게 권유하는 행위</li>
            <li>광고, 스팸, 도배 행위</li>
            <li>개인정보를 무단으로 수집·공개하는 행위</li>
            <li>관련 법령에 위반되는 행위</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-700">제4조 (면책)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>본 서비스에 게시된 정보는 의학적 조언이 아닙니다.</li>
            <li>ADHD의 진단, 치료에 대해서는 반드시 의료 전문가와 상담하세요.</li>
            <li>게시글의 내용에 대한 책임은 작성자에게 있습니다.</li>
            <li>서비스 운영자는 이용자 간의 분쟁에 대해 책임지지 않습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-700">제5조 (게시물의 관리)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>신고가 접수된 게시물은 검토 후 블라인드 처리될 수 있습니다.</li>
            <li>법령에 위반되는 게시물은 사전 통보 없이 삭제될 수 있습니다.</li>
          </ul>
        </section>

        <p className="text-xs text-slate-400 mt-8">
          시행일: 2026년 2월 17일
        </p>
      </div>
    </div>
  );
}
