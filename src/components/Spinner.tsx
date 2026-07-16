interface SpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

const Spinner = ({ size = 32, color = '#3b82f6', className = '' }: SpinnerProps) => (
  <svg
    className={`animate-spin ${className}`}
    width={size}
    height={size}
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="status"
    aria-label="Loading"
  >
    <circle
      cx="25"
      cy="25"
      r="20"
      stroke={color}
      strokeWidth="5"
      strokeDasharray="31.4 31.4"
      strokeLinecap="round"
      fill="none"
      opacity="0.25"
    />
    <path
      d="M25 5a20 20 0 0 1 0 40"
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export default Spinner;
