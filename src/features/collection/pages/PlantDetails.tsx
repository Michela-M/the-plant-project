import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Link from '@components/Link';
import { getPlantDetails } from '../services/getPlantDetails';
import PlantDetailsHeader from '../components/PlantDetailsHeader';
import ImagePreview from '@components/ImagePreview';
import PlantDetailsSchedule from '../components/PlantDetailsSchedule';
import { useToast } from '@context/toast/useToast';
import Spinner from '@components/Spinner';
import { useAuth } from '@context/auth/useAuth';
import PlantDetailsHistory from '../components/PlantDetailsHistory';

export default function PlantDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showError } = useToast();
  const [plantDetails, setPlantDetails] = useState<{
    id: string;
    name: string;
    species: string;
    wateringFrequency: number;
    lastWateredDate: Date | null;
    notes: string;
    creationDate: Date | null;
    imageUrl: string | null;
    trackWatering: boolean;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlantDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const details = await getPlantDetails(id, user?.id || '');
        setPlantDetails(details);
      } catch (error) {
        showError(
          'Error loading plant details',
          error instanceof Error ? error.message : 'Unknown error'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlantDetails();
  }, [id, showError, user?.id]);

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
          commonName: plantDetails?.species || '',
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
            url={plantDetails?.imageUrl || '/public/images/placeholder.jpg'}
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
