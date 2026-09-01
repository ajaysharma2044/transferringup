import { TU } from './shared';
import { SCHOOLS, type School } from '../../data/schools';

function Logo({ school }: { school: School }) {
  return (
    <div className="flex items-center justify-center px-10 shrink-0" style={{ minWidth: 120 }}>
      <img
        src={school.logo}
        alt={school.name}
        title={school.short}
        loading="lazy"
        className="transition-all duration-300"
        style={{
          height: 44,
          width: 'auto',
          objectFit: 'contain',
          filter: 'grayscale(100%)',
          opacity: 0.5,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.filter = 'grayscale(0%)';
          e.currentTarget.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.filter = 'grayscale(100%)';
          e.currentTarget.style.opacity = '0.5';
        }}
      />
    </div>
  );
}

export default function LogoTicker() {
  return (
    <section
      id="schools"
      style={{ background: TU.cream, padding: '28px 0' }}
      className="overflow-hidden"
    >
      <p
        className="text-center"
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: TU.navy,
          opacity: 0.4,
          marginBottom: 20,
        }}
      >
        Students We’ve Placed as Transfers
      </p>

      <div className="relative w-full overflow-hidden">
        <div className="tu-marquee-track items-center">
          {[...SCHOOLS, ...SCHOOLS].map((school, i) => (
            <Logo key={`${school.name}-${i}`} school={school} />
          ))}
        </div>
      </div>
    </section>
  );
}
