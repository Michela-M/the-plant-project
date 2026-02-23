import { addDoc, collection } from 'firebase/firestore';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { addCareEntry } from './addCareEntry';
import { db } from '@services/firebase';

// --- Mock Firestore ---
vi.mock('firebase/firestore', () => ({
  addDoc: vi.fn(),
  collection: vi.fn(),
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
    (collection as Mock).mockReturnValue(mockCollectionRef);
    (addDoc as Mock).mockResolvedValue({ id: '123' });

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
  });

  it('fills in default values when optional fields are missing', async () => {
    const mockCollectionRef = {};
    (collection as Mock).mockReturnValue(mockCollectionRef);
    (addDoc as Mock).mockResolvedValue({ id: '123' });

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
