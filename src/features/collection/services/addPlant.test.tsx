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
    const mockCollectionRef = {};
    (collection as Mock).mockReturnValue(mockCollectionRef);
    (addDoc as Mock).mockResolvedValue({ id: '123' });

    const input = {
      lastWatered: new Date('2024-01-01'),
      name: 'Aloe Vera',
      notes: 'Needs sunlight',
      species: 'Aloe',
      userId: 'test-user',
      wateringFrequency: 7,
    };

    await addPlant(input);

    expect(collection).toHaveBeenCalledWith(db, 'users/test-user/plants');

    expect(addDoc).toHaveBeenCalledWith(mockCollectionRef, {
      creationDate: expect.any(Date),
      lastWatered: new Date('2024-01-01'),
      name: 'Aloe Vera',
      notes: 'Needs sunlight',
      species: 'Aloe',
      wateringFrequency: 7,
    });
  });

  it('fills in default values when optional fields are missing', async () => {
    const mockCollectionRef = {};
    (collection as Mock).mockReturnValue(mockCollectionRef);
    (addDoc as Mock).mockResolvedValue({ id: '123' });

    await addPlant({ name: 'Fern', userId: 'test-user' });

    expect(addDoc).toHaveBeenCalledWith(mockCollectionRef, {
      creationDate: expect.any(Date),
      lastWatered: null,
      name: 'Fern',
      notes: '',
      species: '',
      wateringFrequency: 0,
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
