import { addDoc, collection } from 'firebase/firestore';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { addPlant } from './addPlant';
import { db } from '@services/firebase';

// --- Mock Firestore ---
vi.mock('firebase/firestore', () => ({
  addDoc: vi.fn(),
  collection: vi.fn(),
}));

vi.mock('@services/firebase', () => ({
  db: {},
}));

describe('addPlant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls addDoc with the correct collection and payload', async () => {
    const mockPlantsCollectionRef = {};
    const mockCareEntriesCollectionRef = {};
    (collection as Mock)
      .mockReturnValueOnce(mockPlantsCollectionRef)
      .mockReturnValueOnce(mockCareEntriesCollectionRef);
    (addDoc as Mock).mockResolvedValue({ id: '123' });

    const input = {
      lastWateredDate: new Date('2024-01-01'),
      name: 'Aloe Vera',
      notes: 'Needs sunlight',
      species: 'Aloe',
      userId: 'test-user',
      wateringFrequency: 7,
    };

    await addPlant(input);

    expect(collection).toHaveBeenNthCalledWith(1, db, 'users/test-user/plants');
    expect(collection).toHaveBeenNthCalledWith(
      2,
      db,
      'users/test-user/plants/123/careEntries'
    );

    expect(addDoc).toHaveBeenNthCalledWith(1, mockPlantsCollectionRef, {
      creationDate: expect.any(Date),
      lastWateredDate: new Date('2024-01-01'),
      name: 'Aloe Vera',
      notes: 'Needs sunlight',
      species: 'Aloe',
      wateringFrequency: 7,
      nextWateringDate: new Date('2024-01-08'),
      secondLastWateredDate: null,
      inferredWateringFrequency: null,
      trackWatering: true,
    });

    expect(addDoc).toHaveBeenNthCalledWith(2, mockCareEntriesCollectionRef, {
      careType: 'water',
      date: new Date('2024-01-01'),
      notes: '',
    });
  });

  it('fills in default values when optional fields are missing', async () => {
    const mockCollectionRef = {};
    (collection as Mock).mockReturnValue(mockCollectionRef);
    (addDoc as Mock).mockResolvedValue({ id: '123' });

    await addPlant({ name: 'Fern', userId: 'test-user' });

    expect(addDoc).toHaveBeenCalledWith(mockCollectionRef, {
      creationDate: expect.any(Date),
      lastWateredDate: null,
      name: 'Fern',
      notes: '',
      species: '',
      wateringFrequency: 0,
      nextWateringDate: null,
      secondLastWateredDate: null,
      inferredWateringFrequency: null,
      trackWatering: false,
    });
    expect(addDoc).toHaveBeenCalledTimes(1);
  });

  it('does not track watering when watering frequency is 0', async () => {
    const mockCollectionRef = {};
    (collection as Mock).mockReturnValue(mockCollectionRef);
    (addDoc as Mock).mockResolvedValue({ id: '123' });

    await addPlant({
      userId: 'test-user',
      name: 'Snake Plant',
      lastWateredDate: new Date('2024-01-01'),
      wateringFrequency: 0,
    });

    expect(addDoc).toHaveBeenCalledTimes(2);
    expect(addDoc).toHaveBeenNthCalledWith(1, mockCollectionRef, {
      creationDate: expect.any(Date),
      lastWateredDate: new Date('2024-01-01'),
      name: 'Snake Plant',
      notes: '',
      species: '',
      wateringFrequency: 0,
      nextWateringDate: null,
      secondLastWateredDate: null,
      inferredWateringFrequency: null,
      trackWatering: false,
    });
  });

  it('throws a clean error when addDoc fails', async () => {
    (collection as Mock).mockReturnValue({});
    (addDoc as Mock).mockRejectedValue(new Error('Firestore failed'));

    await expect(
      addPlant({ name: 'Cactus', userId: 'test-user' })
    ).rejects.toThrow('Firestore failed');
  });

  it('wraps non-Error exceptions into a new Error', async () => {
    (collection as Mock).mockReturnValue({});
    (addDoc as Mock).mockRejectedValue('weird error');

    await expect(
      addPlant({ name: 'Cactus', userId: 'test-user' })
    ).rejects.toThrow('Unknown error');
  });
});
