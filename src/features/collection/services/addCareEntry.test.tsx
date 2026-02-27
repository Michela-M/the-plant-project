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

  it('calls addDoc with the correct collection and payload', async () => {
    const mockCollectionRef = {};
    const mockPlantRef = {};
    (collection as Mock).mockReturnValue(mockCollectionRef);
    (doc as Mock).mockReturnValue(mockPlantRef);
    (addDoc as Mock).mockResolvedValue({ id: '123' });
    (getDoc as Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({}),
    });
    (updateDoc as Mock).mockResolvedValue(undefined);

    const input = {
      careType: 'Watering',
      date: new Date('2024-01-01'),
      notes: 'Watered thoroughly',
      plantId: 'plant-123',
      userId: 'test-user',
    };

    await addCareEntry(input);

    expect(collection).toHaveBeenCalledWith(
      db,
      'users/test-user/plants/plant-123/careEntries'
    );

    expect(addDoc).toHaveBeenCalledWith(mockCollectionRef, {
      careType: 'Watering',
      date: new Date('2024-01-01'),
      notes: 'Watered thoroughly',
      otherCareType: '',
    });

    expect(doc).toHaveBeenCalledWith(db, 'users/test-user/plants', 'plant-123');
    expect(updateDoc).toHaveBeenCalledWith(mockPlantRef, {
      lastWateredDate: new Date('2024-01-01'),
      secondLastWateredDate: null,
      inferredWateringFrequency: null,
      nextWateringDate: null,
    });
  });

  it('fills in default values when optional fields are missing', async () => {
    const mockCollectionRef = {};
    (collection as Mock).mockReturnValue(mockCollectionRef);
    (addDoc as Mock).mockResolvedValue({ id: '123' });
    (getDoc as Mock).mockResolvedValue({
      exists: () => false,
      data: () => ({}),
    });

    await addCareEntry({
      careType: 'Fertilizing',
      date: new Date('2024-01-01'),
      plantId: 'plant-123',
      userId: 'test-user',
    });

    expect(addDoc).toHaveBeenCalledWith(mockCollectionRef, {
      careType: 'Fertilizing',
      date: new Date('2024-01-01'),
      notes: '',
      otherCareType: '',
    });

    expect(updateDoc).not.toHaveBeenCalled();
  });

  it('updates last and second last dates when new water entry is newer than current last watered date', async () => {
    const mockCollectionRef = {};
    const mockPlantRef = {};
    const existingLastWateredDate = new Date('2024-01-01');

    (collection as Mock).mockReturnValue(mockCollectionRef);
    (doc as Mock).mockReturnValue(mockPlantRef);
    (addDoc as Mock).mockResolvedValue({ id: '123' });
    (getDoc as Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({
        lastWateredDate: { toDate: () => existingLastWateredDate },
        secondLastWateredDate: { toDate: () => new Date('2023-12-24') },
      }),
    });
    (updateDoc as Mock).mockResolvedValue(undefined);

    const newWaterDate = new Date('2024-01-08');

    await addCareEntry({
      careType: 'water',
      date: newWaterDate,
      plantId: 'plant-123',
      userId: 'test-user',
    });

    expect(updateDoc).toHaveBeenCalledWith(mockPlantRef, {
      lastWateredDate: newWaterDate,
      secondLastWateredDate: existingLastWateredDate,
      inferredWateringFrequency: 7,
      nextWateringDate: new Date('2024-01-15'),
    });
  });

  it('updates secondLastWateredDate when water entry is between current last and second last', async () => {
    const mockCollectionRef = {};
    const mockPlantRef = {};
    const currentLastWateredDate = new Date('2024-01-10');
    const currentSecondLastWateredDate = new Date('2024-01-01');
    const betweenDate = new Date('2024-01-05');

    (collection as Mock).mockReturnValue(mockCollectionRef);
    (doc as Mock).mockReturnValue(mockPlantRef);
    (addDoc as Mock).mockResolvedValue({ id: '123' });
    (getDoc as Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({
        lastWateredDate: { toDate: () => currentLastWateredDate },
        secondLastWateredDate: { toDate: () => currentSecondLastWateredDate },
      }),
    });
    (updateDoc as Mock).mockResolvedValue(undefined);

    await addCareEntry({
      careType: 'water',
      date: betweenDate,
      plantId: 'plant-123',
      userId: 'test-user',
    });

    expect(updateDoc).toHaveBeenCalledWith(mockPlantRef, {
      lastWateredDate: currentLastWateredDate,
      secondLastWateredDate: betweenDate,
      inferredWateringFrequency: 5,
      nextWateringDate: new Date('2024-01-15'),
    });
  });

  it('does not update watering fields when water entry is older than secondLastWateredDate', async () => {
    const mockCollectionRef = {};
    const mockPlantRef = {};

    (collection as Mock).mockReturnValue(mockCollectionRef);
    (doc as Mock).mockReturnValue(mockPlantRef);
    (addDoc as Mock).mockResolvedValue({ id: '123' });
    (getDoc as Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({
        lastWateredDate: { toDate: () => new Date('2024-01-10') },
        secondLastWateredDate: { toDate: () => new Date('2024-01-05') },
      }),
    });

    await addCareEntry({
      careType: 'water',
      date: new Date('2024-01-01'),
      plantId: 'plant-123',
      userId: 'test-user',
    });

    expect(updateDoc).not.toHaveBeenCalled();
  });

  it('throws an error when addDoc fails', async () => {
    (collection as Mock).mockReturnValue({});
    (addDoc as Mock).mockRejectedValue(new Error('Firestore error'));

    await expect(
      addCareEntry({
        careType: 'Pruning',
        date: new Date('2024-01-01'),
        plantId: 'plant-123',
        userId: 'test-user',
      })
    ).rejects.toThrow('Firestore error');
  });

  it('wraps non-Error exceptions into a new Error', async () => {
    (collection as Mock).mockReturnValue({});
    (addDoc as Mock).mockRejectedValue('weird error');

    await expect(
      addCareEntry({
        careType: 'Pruning',
        date: new Date('2024-01-01'),
        plantId: 'plant-123',
        userId: 'test-user',
      })
    ).rejects.toThrow('Unknown error');
  });
});
