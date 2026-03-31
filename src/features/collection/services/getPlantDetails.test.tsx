import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPlantDetails } from './getPlantDetails';
import { doc, getDoc } from 'firebase/firestore';
import type { Mock } from 'vitest';

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
}));

vi.mock('@services/firebase', () => ({
  db: {},
}));

describe('getPlantDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return plant details for a valid plant ID', async () => {
    const mockDocSnap = {
      id: '1',
      exists: () => true,
      data: () => ({
        name: 'Aloe',
        speciesName: 'Aloe Vera',
        speciesId: null,
        wateringFrequency: 7,
        lastWateredDate: { toDate: () => new Date('2024-01-01') },
        notes: 'Sunlight',
        creationDate: { toDate: () => new Date('2024-02-01') },
        imageUrl: 'https://example.com/aloe.jpg',
        nextWateringDate: { toDate: () => new Date('2024-01-08') },
        trackWatering: true,
        secondLastWateredDate: { toDate: () => new Date('2023-12-25') },
        inferredWateringFrequency: 7,
      }),
    };

    // Mock Firestore functions here (doc, getDoc) and set up the expected behavior
    (doc as Mock).mockReturnValue('mockDocRef');
    (getDoc as Mock).mockResolvedValue(mockDocSnap);

    const result = await getPlantDetails('1', 'test-user');

    expect(result).toEqual({
      id: '1',
      name: 'Aloe',
      speciesName: 'Aloe Vera',
      speciesId: null,
      wateringFrequency: 7,
      lastWateredDate: new Date('2024-01-01'),
      notes: 'Sunlight',
      creationDate: new Date('2024-02-01'),
      imageUrl: 'https://example.com/aloe.jpg',
      nextWateringDate: new Date('2024-01-08'),
      trackWatering: true,
      secondLastWateredDate: new Date('2023-12-25'),
      inferredWateringFrequency: 7,
    });
  });

  it('should apply fallback values when optional fields are missing', async () => {
    const mockDocSnap = {
      id: '3',
      exists: () => true,
      data: () => ({}),
    };

    (doc as Mock).mockReturnValue('mockDocRef');
    (getDoc as Mock).mockResolvedValue(mockDocSnap);

    const result = await getPlantDetails('3', 'test-user');

    expect(result).toEqual({
      id: '3',
      name: '',
      speciesName: '',
      speciesId: null,
      wateringFrequency: 0,
      lastWateredDate: null,
      notes: '',
      creationDate: null,
      imageUrl: null,
      nextWateringDate: null,
      trackWatering: false,
      secondLastWateredDate: null,
      inferredWateringFrequency: null,
    });
  });

  it('should return null for a non-existent plant ID', async () => {
    const mockDocSnap = {
      id: '2',
      exists: () => false,
    };

    (doc as Mock).mockReturnValue('mockDocRef');
    (getDoc as Mock).mockResolvedValue(mockDocSnap);

    const result = await getPlantDetails('2', 'test-user');

    expect(result).toBeNull();
  });

  it('should throw an error if there is an issue fetching the document', async () => {
    (doc as Mock).mockReturnValue('mockDocRef');
    (getDoc as Mock).mockRejectedValue(new Error('Firestore error'));

    await expect(getPlantDetails('3', 'test-user')).rejects.toThrow(
      'Firestore error'
    );
  });
});
