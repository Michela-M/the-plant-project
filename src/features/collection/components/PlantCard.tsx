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
          src={
            plant.imageUrl ||
            'https://larchcottage.co.uk/wp-content/uploads/2024/05/placeholder.jpg'
          }
          alt={plant.commonName || 'Plant Image'}
        />
        <div className="flex">
          <div className="grow">
            <p className="text-stone-600">{plant.commonName || ''}</p>
            <p className="text-lg">{plant.name || 'Unnamed Plant'}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
