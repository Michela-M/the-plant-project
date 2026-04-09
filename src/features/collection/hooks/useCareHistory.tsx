import { useAuth } from '@context/auth/useAuth';
import { useToast } from '@context/toast/useToast';
import { useEffect, useState } from 'react';
import { getCareHistory } from '../services/getCareHistory';
import type { CareEntry } from '../type/careType';

export default function useCareHistory(plantId: string) {
  const [careHistory, setCareHistory] = useState<CareEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCareHistory = async () => {
      setLoading(true);
      try {
        const historyData = await getCareHistory(plantId, user?.id || '');
        setCareHistory(historyData);
      } catch (error) {
        showError(
          'Error loading care history',
          error instanceof Error ? error.message : 'Unknown error'
        );
      } finally {
        setLoading(false);
      }
    };

    if (plantId) {
      fetchCareHistory();
    }
  }, [plantId, showError, user?.id]);

  return { careHistory, loading };
}
