export default function PlantCard({
  imageUrl,
  family,
  commonName,
}: {
  imageUrl?: string;
  family?: string;
  commonName?: string;
}) {
  return (
    <div className="">
      <img
        className="aspect-square overflow-hidden object-cover w-full"
        src={
          imageUrl
            ? imageUrl
            : 'https://larchcottage.co.uk/wp-content/uploads/2024/05/placeholder.jpg'
        }
        alt={commonName ? commonName : 'Plant Image'}
      />
      <p className="text-stone-500">{family ? family : 'Family Unknown'}</p>
      <p className="text-lg">{commonName ? commonName : 'Unknown'}</p>
    </div>
  );
}
