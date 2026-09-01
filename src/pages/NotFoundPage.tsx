import Seo from '../components/seo/Seo';
import { CTAButton } from '../components/shared/ui';
import { TU } from '../components/home/shared';

export default function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page Not Found | TransferringUP"
        description="The page you're looking for doesn't exist or has been moved."
        path="/404"
        noindex
      />
      <section
        className="flex flex-col items-center justify-center text-center"
        style={{ background: TU.navy, minHeight: '100dvh', padding: '0 24px' }}
      >
        <div
          style={{
            fontFamily: '"Fraunces", serif',
            fontWeight: 700,
            fontSize: 120,
            color: TU.offwhite,
            opacity: 0.15,
            lineHeight: 1,
          }}
        >
          404
        </div>
        <h1
          style={{
            fontFamily: '"Fraunces", serif',
            fontWeight: 700,
            fontSize: 36,
            color: TU.offwhite,
            marginTop: 8,
          }}
        >
          Page not found.
        </h1>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 18,
            color: TU.offwhite,
            opacity: 0.6,
            marginTop: 12,
            maxWidth: 440,
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ marginTop: 32 }}>
          <CTAButton href="/">Back to Home →</CTAButton>
        </div>
      </section>
    </>
  );
}
