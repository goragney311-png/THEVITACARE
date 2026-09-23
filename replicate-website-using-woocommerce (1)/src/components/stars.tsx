export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex text-amber-400" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill={i <= Math.round(value) ? "currentColor" : "#e2e8f0"}>
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L10 14.9l-5.3 2.8 1.1-5.9L1.5 7.7l5.9-.8z" />
        </svg>
      ))}
    </span>
  );
}
