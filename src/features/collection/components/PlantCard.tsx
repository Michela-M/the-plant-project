import { Callout } from '@components/Typography';
import { Link } from 'react-router-dom';

type PlantCardProps = {
  plant: {
    imageUrl?: string;
    commonName?: string;
    name: string;
    id: string;
  };
};

export default function PlantCard({ plant }: PlantCardProps) {
  return (
    <Link to={`/plants/${plant.id}`}>
      <div>
        <img
          className="aspect-square overflow-hidden object-cover w-full"
          src={plant.imageUrl || '/src/assets/images/placeholder.jpg'}
          alt={
            plant.imageUrl
              ? `${plant.name} image`
              : `No photo available for ${plant.name}`
          }
        />
        <div className="flex">
          <div className="grow">
            <Callout className="text-stone-600">
              {plant.commonName || ''}
            </Callout>
            <p>{plant.name || 'Unnamed Plant'}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
