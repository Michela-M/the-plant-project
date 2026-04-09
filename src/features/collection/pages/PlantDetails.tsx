import ImagePreview from '@components/ImagePreview';
import Link from '@components/Link';
import Spinner from '@components/Spinner';
import PlantDetailsHeader from '../components/PlantDetailsHeader';
import PlantDetailsHistory from '../components/PlantDetailsHistory';
import PlantDetailsSchedule from '../components/PlantDetailsSchedule';
import usePlantDetails from '../hooks/usePlantDetails';

export default function PlantDetails() {
  const { plantDetails, loading, setPlantDetails } = usePlantDetails();

  if (loading) {
    return <Spinner label="Loading plant details..." />;
  }

  if (!plantDetails) {
    return (
      <div className="w-2/3 mx-auto py-8 flex flex-col items-center gap-2">
        <p className="text-center text-stone-500">Plant not found.</p>
        <Link href="/collection">Back to Collection</Link>
      </div>
    );
  }

  return (
    <div className="w-2/3 mx-auto py-8 flex flex-col gap-4">
      <PlantDetailsHeader
        plant={{
          id: plantDetails?.id || '',
          name: plantDetails?.name || '',
          commonName: plantDetails?.speciesName || '',
          commonNameId: plantDetails?.speciesId || undefined,
          trackWatering: plantDetails?.trackWatering || false,
        }}
        onTrackWateringChange={(trackWatering) => {
          setPlantDetails((prev) =>
            prev
              ? {
                  ...prev,
                  trackWatering,
                }
              : prev
          );
        }}
      />
      <div className="flex gap-6">
        <div className="w-5/8 flex flex-col gap-6">
          <p>{plantDetails?.notes}</p>
          <div>
            <PlantDetailsHistory plantId={plantDetails?.id || ''} />
          </div>
        </div>
        <div className="w-3/8 flex flex-col gap-6">
          <ImagePreview
            url={plantDetails?.imageUrl || '/images/placeholder.jpg'}
            alt={
              plantDetails?.imageUrl
                ? `${plantDetails.name} image`
                : `No photo available for ${plantDetails.name}`
            }
          />
          <PlantDetailsSchedule
            plant={{
              wateringFrequency: plantDetails?.wateringFrequency,
              lastWateredDate: plantDetails?.lastWateredDate,
            }}
          />
        </div>
      </div>
    </div>
  );
}
