const colorMap = {
  'stone-50': 'text-stone-50',
  'green-600': 'text-green-600',
  'green-800': 'text-green-800',
  'red-800': 'text-red-800',
};

export default function Spinner() {
  return (
    <div className="w-full h-64 flex items-center justify-center">
      <svg
        className="animate-spin h-10 w-10 text-green-800"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function InlineSpinner({
  color = 'green-800',
}: {
  color?: 'stone-50' | 'green-600' | 'green-800' | 'red-800';
}) {
  return (
    <>
      <svg
        className={`animate-spin h-5 w-5 ${colorMap[color]} inline-block`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </>
  );
}
