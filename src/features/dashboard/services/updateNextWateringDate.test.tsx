import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@services/firebase';
import { updateNextWatering } from './updateNextWateringDate';

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: vi.fn(),
}));

vi.mock('@services/firebase', () => ({
  db: {},
}));

describe('updateNextWatering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates nextWateringDate for an active reminder', async () => {
    const mockPlantRef = {};
    const nextWateringDate = new Date('2026-03-08T10:00:00.000Z');

    (doc as Mock).mockReturnValue(mockPlantRef);
    (updateDoc as Mock).mockResolvedValue(undefined);

    await updateNextWatering('plant-1', 'user-1', nextWateringDate);

    expect(doc).toHaveBeenCalledWith(db, 'users/user-1/plants', 'plant-1');
    expect(updateDoc).toHaveBeenCalledWith(mockPlantRef, {
      nextWateringDate,
    });
  });

  it('disables tracking when nextWateringDate is null', async () => {
    const mockPlantRef = {};

    (doc as Mock).mockReturnValue(mockPlantRef);
    (updateDoc as Mock).mockResolvedValue(undefined);

    await updateNextWatering('plant-1', 'user-1', null);

    expect(updateDoc).toHaveBeenCalledWith(mockPlantRef, {
      nextWateringDate: null,
      trackWatering: false,
    });
  });

  it('rethrows original Error instances', async () => {
    const firestoreError = new Error('Permission denied');

    (doc as Mock).mockReturnValue({});
    (updateDoc as Mock).mockRejectedValue(firestoreError);

    await expect(
      updateNextWatering('plant-1', 'user-1', new Date('2026-03-08T10:00:00Z'))
    ).rejects.toThrow('Permission denied');
  });

  it('throws Unknown error for non-Error failures', async () => {
    (doc as Mock).mockReturnValue({});
    (updateDoc as Mock).mockRejectedValue('failure');

    await expect(
      updateNextWatering('plant-1', 'user-1', new Date('2026-03-08T10:00:00Z'))
    ).rejects.toThrow('Unknown error');
  });
});
