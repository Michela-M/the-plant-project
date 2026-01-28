import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <>
      <nav className="p-4 px-8 flex justify-between items-baseline text-green-900">
        <Link to="/" className="text-4xl font-bold p-4 align-middle">
          the plant project
        </Link>
        <MenuItem label="Dashboard" link="/" />
        <MenuItem label="Encyclopedia" link="/Encyclopedia" />
        <MenuItem label="My Collection" link="/Collection" />
        <MenuItem label="Settings" />
      </nav>
    </>
  );
}

function MenuItem({ label, link }: { label: string; link?: string }) {
  return (
    <Link to={link || '/'}>
      <div className="p-4 hover:underline text-xl">{label}</div>
    </Link>
  );
}
