import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPlantDetails } from '../services/getPlantDetails';
import PlantDetailsHeader from '../features/collection/PlantDetailsHeader';
import ImagePreview from '../components/ImagePreview';
import PlantDetailsSchedule from '../features/collection/PlantDetailsSchedule';

export default function PlantDetails() {
  const { id } = useParams();
  const [plantDetails, setPlantDetails] = useState<{
    id: string;
    name: string;
    species: string;
    wateringFrequency: number;
    lastWatered: Date;
    notes: string;
    creationDate: Date;
  } | null>(null);

  useEffect(() => {
    const fetchPlantDetails = async () => {
      if (!id) return;
      try {
        const details = await getPlantDetails(id);
        setPlantDetails(details);
        console.log('Fetched plant details:', details);
      } catch (error) {
        console.error('Error fetching plant details:', error);
      }
    };

    fetchPlantDetails();
  }, [id]);

  return (
    <div className="w-2/3 mx-auto py-8 flex flex-col gap-4">
      <PlantDetailsHeader
        plant={{
          id: plantDetails?.id || '',
          name: plantDetails?.name || '',
          commonName: plantDetails?.species || '',
        }}
      />
      <div className="flex">
        <div className="w-5/8 h-64 flex flex-col gap-6">
          {plantDetails ? (
            <>
              <p>{plantDetails.notes}</p>
              <div>
                <h2 className="text-2xl">History</h2>
                <p className="text-stone-500">No notes yet.</p>
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className="w-3/8 flex flex-col gap-6">
          <ImagePreview
            url="https://img.freepik.com/photos-gratuite/codage-programme-informatique-ecran_53876-138060.jpg?semt=ais_wordcount_boost&w=740&q=80"
            alt="Placeholder image"
          />
          <PlantDetailsSchedule
            plant={{
              wateringFrequency: plantDetails?.wateringFrequency,
              lastWatered: plantDetails?.lastWatered,
            }}
          />
        </div>
      </div>
    </div>
  );
}
