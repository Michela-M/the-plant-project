import { Link as RouterLink } from 'react-router-dom';

export default function Link({
  href = '#',
  children = 'Click here',
}: {
  href?: string;
  children?: React.ReactNode;
}) {
  return (
    <RouterLink
      to={href}
      className="text-green-800 underline hover:text-green-900 active:text-green-950"
    >
      {children}
    </RouterLink>
  );
}
