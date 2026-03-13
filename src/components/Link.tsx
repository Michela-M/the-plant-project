import { Link as RouterLink } from 'react-router-dom';

export default function Link({
  href,
  children,
}: Readonly<{
  href: string;
  children: React.ReactNode;
}>) {
  const isExternal = href.startsWith('http');

  return (
    <RouterLink
      to={href}
      className="text-green-800 underline hover:text-green-900 active:text-green-950 focus-visible:outline-2 focus-visible:outline-green-800 focus-visible:outline-offset-2 rounded-sm"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children}
      {isExternal && <span className="sr-only">(opens in new tab)</span>}
    </RouterLink>
  );
}
