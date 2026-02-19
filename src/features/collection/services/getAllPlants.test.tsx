import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@services/firebase';
import { getAllPlants } from './getAllPlants';

// --- Mock Firestore ---
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
}));

vi.mock('@services/firebase', () => ({
  db: {},
}));

describe('getAllPlants', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a normalized list of plants when documents exist', async () => {
    const mockCollectionRef = {};
    const mockQueryRef = {};

    (collection as Mock).mockReturnValue(mockCollectionRef);
    (query as Mock).mockReturnValue(mockQueryRef);

    const mockDocs = [
      {
        data: () => ({
          imageUrl: 'https://example.com/aloe.jpg',
          name: 'Aloe',
          species: 'Aloe Vera',
        }),
        id: '1',
      },
    ];

    (getDocs as Mock).mockResolvedValue({ docs: mockDocs });

    const result = await getAllPlants('test-user');

    expect(collection).toHaveBeenCalledWith(db, 'users/test-user/plants');
    expect(orderBy).toHaveBeenCalledWith('creationDate', 'desc');
    expect(query).toHaveBeenCalledWith(
      mockCollectionRef,
      orderBy('creationDate', 'desc')
    );
    expect(getDocs).toHaveBeenCalledWith(mockQueryRef);

    expect(result).toEqual([
      {
        id: '1',
        name: 'Aloe',
        species: 'Aloe Vera',
        imageUrl: 'https://example.com/aloe.jpg',
      },
    ]);
  });

  it('returns an empty array when no documents exist', async () => {
    (collection as Mock).mockReturnValue({});
    (query as Mock).mockReturnValue({});
    (getDocs as Mock).mockResolvedValue({ docs: [] });

    const result = await getAllPlants('test-user');

    expect(result).toEqual([]);
  });

  it('throws an error when Firestore fails', async () => {
    (collection as Mock).mockReturnValue({});
    (query as Mock).mockReturnValue({});
    (getDocs as Mock).mockRejectedValue(new Error('Firestore error'));

    await expect(getAllPlants('test-user')).rejects.toThrow('Firestore error');
  });

  it('normalizes missing fields to safe defaults', async () => {
    (collection as Mock).mockReturnValue({});
    (query as Mock).mockReturnValue({});

    const mockDocs = [
      {
        id: '123',
        data: () => ({
          // Name missing
          // Species missing
        }),
      },
    ];

    (getDocs as Mock).mockResolvedValue({ docs: mockDocs });

    const result = await getAllPlants('test-user');

    expect(result).toEqual([
      {
        id: '123',
        name: 'Unnamed Plant',
        species: '',
        imageUrl: null,
      },
    ]);
  });
});
