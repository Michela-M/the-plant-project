import IconTile from '../components/IconTile';
import { Bubbles } from 'lucide-react';

export default function Dashboard() {
  return (
    <>
      <IconTile Icon={Bubbles} color="green" label="Plant category" />
      <br />
      <IconTile Icon={Bubbles} color="red" label="Plant category" />
    </>
  );
}
