import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPlantDetails } from './getPlantDetails';
import { doc, getDoc } from 'firebase/firestore';
import type { Mock } from 'vitest';

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
}));

vi.mock('../firebase', () => ({
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
        species: 'Aloe Vera',
        wateringFrequency: 7,
        lastWatered: { toDate: () => new Date('2024-01-01') },
        notes: 'Sunlight',
        creationDate: { toDate: () => new Date('2024-02-01') },
        imageUrl: 'https://example.com/aloe.jpg',
      }),
    };

    // Mock Firestore functions here (doc, getDoc) and set up the expected behavior
    (doc as Mock).mockReturnValue('mockDocRef');
    (getDoc as Mock).mockResolvedValue(mockDocSnap);

    const result = await getPlantDetails('1');

    expect(result).toEqual({
      id: '1',
      name: 'Aloe',
      species: 'Aloe Vera',
      wateringFrequency: 7,
      lastWatered: new Date('2024-01-01'),
      notes: 'Sunlight',
      creationDate: new Date('2024-02-01'),
      imageUrl: 'https://example.com/aloe.jpg',
    });
  });

  it('should return null for a non-existent plant ID', async () => {
    const mockDocSnap = {
      id: '2',
      exists: () => false,
    };

    (doc as Mock).mockReturnValue('mockDocRef');
    (getDoc as Mock).mockResolvedValue(mockDocSnap);

    const result = await getPlantDetails('2');

    expect(result).toBeNull();
  });

  it('should throw an error if there is an issue fetching the document', async () => {
    (doc as Mock).mockReturnValue('mockDocRef');
    (getDoc as Mock).mockRejectedValue(new Error('Firestore error'));

    await expect(getPlantDetails('3')).rejects.toThrow('Firestore error');
  });
});
