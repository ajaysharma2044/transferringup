/* A slim gradient band placed between two sections whose background colours
   differ sharply (dark ↔ light). It eases the colour from the previous
   section's base into the next one's, so the seam reads as an intentional
   fade instead of a hard cut. Purely decorative. */
export default function SectionSeam({
  from,
  to,
  height = 'clamp(56px, 7vw, 104px)',
}: {
  from: string;
  to: string;
  height?: string;
}) {
  return (
    <div
      aria-hidden
      style={{
        height,
        background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)`,
      }}
    />
  );
}
