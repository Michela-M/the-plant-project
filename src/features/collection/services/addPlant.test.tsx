import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { addPlant } from './addPlant';
import { addDoc, collection } from 'firebase/firestore';
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
      name: 'Aloe Vera',
      species: 'Aloe',
      wateringFrequency: 7,
      lastWatered: new Date('2024-01-01'),
      notes: 'Needs sunlight',
    };

    await addPlant(input);

    expect(collection).toHaveBeenCalledWith(db, 'test-plants');

    expect(addDoc).toHaveBeenCalledWith(mockCollectionRef, {
      name: 'Aloe Vera',
      species: 'Aloe',
      wateringFrequency: 7,
      lastWatered: new Date('2024-01-01'),
      notes: 'Needs sunlight',
      creationDate: expect.any(Date),
    });
  });

  it('fills in default values when optional fields are missing', async () => {
    const mockCollectionRef = {};
    (collection as Mock).mockReturnValue(mockCollectionRef);
    (addDoc as Mock).mockResolvedValue({ id: '123' });

    await addPlant({ name: 'Fern' });

    expect(addDoc).toHaveBeenCalledWith(mockCollectionRef, {
      name: 'Fern',
      species: '',
      wateringFrequency: 0,
      lastWatered: null,
      notes: '',
      creationDate: expect.any(Date),
    });
  });

  it('throws a clean error when addDoc fails', async () => {
    (collection as Mock).mockReturnValue({});
    (addDoc as Mock).mockRejectedValue(new Error('Firestore failed'));

    await expect(addPlant({ name: 'Cactus' })).rejects.toThrow(
      'Firestore failed'
    );
  });

  it('wraps non-Error exceptions into a new Error', async () => {
    (collection as Mock).mockReturnValue({});
    (addDoc as Mock).mockRejectedValue('weird error');

    await expect(addPlant({ name: 'Cactus' })).rejects.toThrow('Unknown error');
  });
});
