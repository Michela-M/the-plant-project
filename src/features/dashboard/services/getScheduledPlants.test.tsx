import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '@services/firebase';
import { getScheduledPlants } from './getScheduledPlants';

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
}));

vi.mock('@services/firebase', () => ({
  db: {},
}));

describe('getScheduledPlants', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('builds the expected Firestore query and returns normalized plants', async () => {
    const mockCollectionRef = {};
    const mockWhereRef = {};
    const mockOrderByRef = {};
    const mockQueryRef = {};

    (collection as Mock).mockReturnValue(mockCollectionRef);
    (where as Mock).mockReturnValue(mockWhereRef);
    (orderBy as Mock).mockReturnValue(mockOrderByRef);
    (query as Mock).mockReturnValue(mockQueryRef);

    const lastWateredDate = new Date('2026-03-01T10:00:00Z');
    const nextWateringDate = new Date('2026-03-02T10:00:00Z');

    (getDocs as Mock).mockResolvedValue({
      docs: [
        {
          id: 'plant-1',
          data: () => ({
            imageUrl: 'https://example.com/monstera.jpg',
            name: 'Monstera',
            speciesName: 'Monstera deliciosa',
            wateringFrequency: 7,
            nextWateringDate: { toDate: () => nextWateringDate },
            lastWateredDate: { toDate: () => lastWateredDate },
            inferredWateringFrequency: 8,
          }),
        },
      ],
    });

    const result = await getScheduledPlants('user-123');

    expect(collection).toHaveBeenCalledWith(db, 'users', 'user-123', 'plants');
    expect(where).toHaveBeenCalledWith('trackWatering', '==', true);
    expect(orderBy).toHaveBeenCalledWith('nextWateringDate', 'asc');
    expect(query).toHaveBeenCalledWith(
      mockCollectionRef,
      mockWhereRef,
      mockOrderByRef
    );
    expect(getDocs).toHaveBeenCalledWith(mockQueryRef);

    expect(result).toEqual([
      {
        id: 'plant-1',
        imageUrl: 'https://example.com/monstera.jpg',
        name: 'Monstera',
        species: 'Monstera deliciosa',
        wateringFrequency: 7,
        nextWateringDate,
        lastWateredDate,
        inferredWateringFrequency: 8,
      },
    ]);
  });

  it('returns safe defaults when optional fields are missing', async () => {
    (collection as Mock).mockReturnValue({});
    (where as Mock).mockReturnValue({});
    (orderBy as Mock).mockReturnValue({});
    (query as Mock).mockReturnValue({});

    (getDocs as Mock).mockResolvedValue({
      docs: [
        {
          id: 'plant-2',
          data: () => ({}),
        },
      ],
    });

    const result = await getScheduledPlants('user-123');

    expect(result).toEqual([
      {
        id: 'plant-2',
        imageUrl: null,
        name: 'Unnamed Plant',
        species: '',
        wateringFrequency: null,
        nextWateringDate: null,
        lastWateredDate: null,
        inferredWateringFrequency: null,
      },
    ]);
  });

  it('returns an empty array when no plants are scheduled', async () => {
    (collection as Mock).mockReturnValue({});
    (where as Mock).mockReturnValue({});
    (orderBy as Mock).mockReturnValue({});
    (query as Mock).mockReturnValue({});
    (getDocs as Mock).mockResolvedValue({ docs: [] });

    const result = await getScheduledPlants('user-123');

    expect(result).toEqual([]);
  });

  it('throws when Firestore getDocs fails', async () => {
    (collection as Mock).mockReturnValue({});
    (where as Mock).mockReturnValue({});
    (orderBy as Mock).mockReturnValue({});
    (query as Mock).mockReturnValue({});
    (getDocs as Mock).mockRejectedValue(new Error('Firestore error'));

    await expect(getScheduledPlants('user-123')).rejects.toThrow(
      'Firestore error'
    );
  });
});
