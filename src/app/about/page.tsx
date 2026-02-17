import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '소개',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">소개</h1>
      <div className="prose max-w-none text-sm leading-relaxed space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">ADHD 커뮤니티란?</h2>
          <p>
            ADHD 커뮤니티는 ADHD(주의력결핍 과잉행동장애) 당사자, 부모, 가족, 그리고 관심 있는
            모든 분들을 위한 오픈 커뮤니티입니다. 회원가입 없이 누구나 자유롭게 정보를 나누고
            서로의 경험을 공유할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">운영 원칙</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>정보 공유</strong>: ADHD 관련 경험, 정보, 팁을 자유롭게 나눕니다.
            </li>
            <li>
              <strong>상호 존중</strong>: 모든 이용자는 서로를 존중하며, 비방이나 차별적 표현을 금지합니다.
            </li>
            <li>
              <strong>익명성 보장</strong>: 회원가입 없이 익명으로 참여할 수 있으며, 개인정보를
              최소한으로 처리합니다.
            </li>
            <li>
              <strong>건전한 토론</strong>: 다양한 의견을 존중하되, 근거 없는 정보 유포를 지양합니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">의학적 면책</h2>
          <p>
            본 커뮤니티에 게시된 모든 정보는 이용자 간의 경험 공유를 목적으로 하며,{' '}
            <strong>의학적 조언이 아닙니다</strong>. ADHD의 진단, 치료, 약물 복용 등에 대해서는
            반드시 의료 전문가(정신건강의학과 전문의)와 상담하시기 바랍니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">연락처</h2>
          <p>
            사이트 운영 관련 문의, 게시물 신고, 개인정보 관련 요청은 아래 이메일로 연락해주세요.
          </p>
          <p>
            <a
              href="mailto:joonit1362@gmail.com"
              className="text-primary hover:underline"
            >
              joonit1362@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
