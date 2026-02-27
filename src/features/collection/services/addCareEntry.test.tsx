import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { addCareEntry } from './addCareEntry';
import { db } from '@services/firebase';

// --- Mock Firestore ---
vi.mock('firebase/firestore', () => ({
  addDoc: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
}));

vi.mock('@services/firebase', () => ({
  db: {},
}));

describe('addCareEntry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a care entry with defaults for optional fields', async () => {
    const careData = {
      careType: 'prune',
      date: new Date('2024-01-10'),
      plantId: 'plant-1',
      userId: 'user-1',
    };

    (addDoc as Mock).mockResolvedValue({ id: 'entry-1' });

    await addCareEntry(careData);

    expect(collection).toHaveBeenCalledWith(
      db,
      `users/${careData.userId}/plants/${careData.plantId}/careEntries`
    );

    const [, careEntryDoc] = (addDoc as Mock).mock.calls[0];
    expect(careEntryDoc).toEqual(
      expect.objectContaining({
        careType: 'prune',
        date: careData.date,
        notes: '',
        otherCareType: '',
      })
    );
  });

  it('does not update plant watering fields for non-water care entries', async () => {
    (addDoc as Mock).mockResolvedValue({ id: 'entry-1' });

    await addCareEntry({
      careType: 'fertilize',
      date: new Date('2024-01-10'),
      notes: 'monthly',
      plantId: 'plant-1',
      userId: 'user-1',
    });

    expect(getDoc).not.toHaveBeenCalled();
    expect(updateDoc).not.toHaveBeenCalled();
  });

  it('updates last and second-last watering dates when water date is newer than last', async () => {
    const newWaterDate = new Date('2024-01-10');
    const existingLastWateredDate = new Date('2024-01-01');

    (addDoc as Mock).mockResolvedValue({ id: 'entry-1' });
    (getDoc as Mock).mockResolvedValue({
      data: () => ({
        inferredWateringFrequency: 0,
        lastWateredDate: existingLastWateredDate,
        secondLastWateredDate: null,
        wateringFrequency: 3,
      }),
      exists: () => true,
    });

    await addCareEntry({
      careType: 'water',
      date: newWaterDate,
      plantId: 'plant-1',
      userId: 'user-1',
    });

    const plantRef = (doc as Mock).mock.results[0].value;
    expect(doc).toHaveBeenCalledWith(db, 'users/user-1/plants/plant-1');
    expect(getDoc).toHaveBeenCalledWith(plantRef);

    expect(updateDoc).toHaveBeenCalledWith(
      plantRef,
      expect.objectContaining({
        inferredWateringFrequency: 9,
        lastWateredDate: newWaterDate,
        nextWateringDate: new Date('2024-01-13'),
        secondLastWateredDate: existingLastWateredDate,
      })
    );
  });

  it('updates second-last date when water date is between last and second-last', async () => {
    const newWaterDate = new Date('2024-01-06');
    const existingLastWateredDate = new Date('2024-01-10');
    const existingSecondLastWateredDate = new Date('2024-01-01');

    (addDoc as Mock).mockResolvedValue({ id: 'entry-1' });
    (getDoc as Mock).mockResolvedValue({
      data: () => ({
        inferredWateringFrequency: 0,
        lastWateredDate: existingLastWateredDate,
        secondLastWateredDate: existingSecondLastWateredDate,
        wateringFrequency: 0,
      }),
      exists: () => true,
    });

    await addCareEntry({
      careType: 'water',
      date: newWaterDate,
      plantId: 'plant-1',
      userId: 'user-1',
    });

    const plantRef = (doc as Mock).mock.results[0].value;

    expect(updateDoc).toHaveBeenCalledWith(
      plantRef,
      expect.objectContaining({
        inferredWateringFrequency: 4,
        lastWateredDate: existingLastWateredDate,
        nextWateringDate: new Date('2024-01-14'),
        secondLastWateredDate: newWaterDate,
      })
    );
  });

  it('returns without updating plant fields when plant document does not exist', async () => {
    (addDoc as Mock).mockResolvedValue({ id: 'entry-1' });
    (getDoc as Mock).mockResolvedValue({
      data: () => undefined,
      exists: () => false,
    });

    await addCareEntry({
      careType: 'water',
      date: new Date('2024-01-10'),
      plantId: 'plant-1',
      userId: 'user-1',
    });

    expect(updateDoc).not.toHaveBeenCalled();
  });

  it('propagates errors from care-entry creation', async () => {
    const error = new Error('Firestore write failed');
    (addDoc as Mock).mockRejectedValue(error);

    await expect(
      addCareEntry({
        careType: 'water',
        date: new Date('2024-01-10'),
        plantId: 'plant-1',
        userId: 'user-1',
      })
    ).rejects.toThrow(error);
  });

  it('propagates errors from plant update', async () => {
    (addDoc as Mock).mockResolvedValue({ id: 'entry-1' });
    (getDoc as Mock).mockResolvedValue({
      data: () => ({
        inferredWateringFrequency: 0,
        lastWateredDate: new Date('2024-01-01'),
        secondLastWateredDate: null,
        wateringFrequency: 3,
      }),
      exists: () => true,
    });
    (updateDoc as Mock).mockRejectedValue(new Error('Update failed'));

    await expect(
      addCareEntry({
        careType: 'water',
        date: new Date('2024-01-10'),
        plantId: 'plant-1',
        userId: 'user-1',
      })
    ).rejects.toThrow('Update failed');
  });
});
