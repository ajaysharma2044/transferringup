const items = [
  '12 to Cornell',
  '8 to Vanderbilt',
  '15 to Michigan',
  '22 to NYU',
  '9 to USC',
  '6 to Northwestern',
  '4 to Columbia',
  '5 to UPenn',
  '7 to Johns Hopkins',
  '11 to UVA',
  '3 to Brown',
  '6 to Georgetown',
  '8 to Notre Dame',
  '5 to Emory',
  '4 to Dartmouth',
];

// Duplicated for a seamless -50% loop.
const doubled = [...items, ...items];

export default function AcceptanceTicker() {
  return (
    <div className="tu-ticker" aria-hidden="true">
      <div className="tu-ticker__track">
        {doubled.map((item, i) => (
          <span key={i} className="tu-ticker__item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
