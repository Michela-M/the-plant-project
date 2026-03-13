import { useEffect, useState } from 'react';
import {
  getScheduledPlants,
  type ScheduledPlant,
} from '../services/getScheduledPlants';
import { partitionScheduledPlants } from '../services/partitionScheduledPlants';
import { useToast } from '@context/toast/useToast';
import { useAuth } from '@context/auth/useAuth';
import Spinner from '@components/Spinner';
import Button from '@components/Button';
import TodayCareSection from '../components/TodayCareSection';
import UpcomingCareSection from '../components/UpcomingCareSection';
import { H1 } from '@components/Typography';
import CareModal from '../../collection/components/CareModal';

export default function Dashboard() {
  const [plants, setPlants] = useState<ScheduledPlant[]>([]);
  const { showError } = useToast();
  const [showCareModal, setShowCareModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      try {
        const plantsData = await getScheduledPlants(user?.id || '');
        setPlants(plantsData);
      } catch (error) {
        showError(
          'Error loading plants',
          error instanceof Error ? error.message : 'Unknown error'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, [showError, user]);

  const { todayOrOverdue, afterToday } = partitionScheduledPlants(plants);

  if (loading) {
    return <Spinner label="Loading dashboard..." />;
  }

  return (
    <div className="w-3/4 mx-auto py-8 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <H1>Care Dashboard</H1>
        <Button
          onClick={() => setShowCareModal(true)}
          label="New entry"
          ariaLabel="New entry"
        />
      </div>
      <p>
        These care reminders are general guidelines based on typical plant
        needs. Always check your plant before watering, fertilizing, or
        repotting — conditions vary, and plants may not always follow the
        expected schedule.
      </p>
      {todayOrOverdue.length > 0 && (
        <TodayCareSection plants={todayOrOverdue} />
      )}
      <UpcomingCareSection plants={afterToday} />
      {showCareModal && <CareModal setShowCareModal={setShowCareModal} />}
    </div>
  );
}
