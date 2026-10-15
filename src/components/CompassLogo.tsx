// Compass SVG logo component
export function CompassLogo({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer ring */}
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1" opacity="0.15" />

      {/* Cardinal tick marks */}
      <line x1="24" y1="2" x2="24" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="41" x2="24" y2="46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="2" y1="24" x2="7" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="41" y1="24" x2="46" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

      {/* Compass needle - North (teal) */}
      <polygon
        points="24,8 27,24 24,21 21,24"
        fill="#14b8a6"
        opacity="0.9"
      />
      {/* Compass needle - South (amber) */}
      <polygon
        points="24,40 27,24 24,27 21,24"
        fill="#f59e0b"
        opacity="0.7"
      />

      {/* Center dot */}
      <circle cx="24" cy="24" r="2.5" fill="currentColor" />
      <circle cx="24" cy="24" r="1" fill="white" />

      {/* N label */}
      <text
        x="24"
        y="17"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#14b8a6"
        fontSize="5"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        N
      </text>
    </svg>
  );
}
