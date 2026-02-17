import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">개인정보처리방침</h1>
      <div className="prose max-w-none text-sm leading-relaxed space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. 수집하는 개인정보</h2>
          <p>본 커뮤니티는 회원가입을 요구하지 않으며, 최소한의 정보만 처리합니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>IP 주소</strong>: 게시글/댓글 작성 시 해시(SHA-256) 처리하여 저장합니다. 원본 IP는 저장하지 않습니다.</li>
            <li><strong>닉네임</strong>: 사용자가 자발적으로 입력한 닉네임 (기본값: 익명)</li>
            <li><strong>쿠키</strong>: 서비스 이용 및 광고에 필요한 쿠키를 사용합니다 (아래 4항 참조).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">2. 개인정보의 처리 목적</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>게시글/댓글 작성자 식별 (중복 방지, 신고 처리)</li>
            <li>서비스 악용 방지 (도배, 스팸 차단)</li>
            <li>서비스 이용 통계 분석 및 개선</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">3. 개인정보의 보관 기간</h2>
          <p>해시 처리된 IP 정보는 게시글/댓글이 존재하는 동안 보관되며, 삭제 시 함께 파기됩니다.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">4. 광고 및 쿠키</h2>
          <p>
            본 커뮤니티는 Google AdSense를 통한 광고를 게재합니다. Google AdSense는 다음과 같은
            쿠키를 사용할 수 있습니다.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>DoubleClick 쿠키</strong>: 사용자의 관심사에 기반한 맞춤 광고를 제공하기 위해
              사용됩니다.
            </li>
            <li>
              <strong>Google 광고 쿠키</strong>: 광고 게재 빈도 관리, 광고 클릭 추적 등의 목적으로
              사용됩니다.
            </li>
          </ul>
          <p>
            Google의 개인정보 처리에 대한 자세한 내용은{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google 개인정보처리방침
            </a>
            을 참고하세요.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">5. 쿠키 옵트아웃</h2>
          <p>사용자는 다음 방법으로 광고 쿠키를 거부할 수 있습니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google 광고 설정
              </a>
              에서 개인 맞춤 광고를 비활성화할 수 있습니다.
            </li>
            <li>
              브라우저 설정에서 쿠키를 차단하거나 삭제할 수 있습니다. 단, 쿠키 차단 시 일부 서비스
              이용이 제한될 수 있습니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">6. 제3자 제공</h2>
          <p>
            본 커뮤니티는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의
            경우에는 예외로 합니다.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>법령에 의해 요구되는 경우</li>
            <li>
              Google AdSense 및 Google Analytics를 통한 서비스 운영 (익명화/집계된 데이터만 수집)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">7. 이용자의 권리</h2>
          <p>이용자는 다음과 같은 권리를 행사할 수 있습니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>본인이 작성한 게시글/댓글의 삭제 요청</li>
            <li>개인정보 처리 현황 열람 요청</li>
            <li>개인정보 삭제 요청</li>
          </ul>
          <p>
            위 요청은 아래 연락처로 이메일을 보내주시면 확인 후 처리해 드립니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">8. 문의</h2>
          <p>
            개인정보 관련 문의사항은 아래 이메일로 연락해주세요.
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

        <p className="text-xs text-muted-foreground/60 mt-8">
          시행일: 2026년 2월 17일
        </p>
      </div>
    </div>
  );
}
