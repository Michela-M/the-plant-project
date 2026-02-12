import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllPlants } from './getAllPlants';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import type { Mock } from 'vitest';

// --- Mock Firestore ---
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
}));

vi.mock('../firebase', () => ({
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
        id: '1',
        data: () => ({
          name: 'Aloe',
          species: 'Aloe Vera',
          imageUrl: 'https://example.com/aloe.jpg',
        }),
      },
    ];

    (getDocs as Mock).mockResolvedValue({ docs: mockDocs });

    const result = await getAllPlants();

    expect(collection).toHaveBeenCalledWith(db, 'test-plants');
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

    const result = await getAllPlants();

    expect(result).toEqual([]);
  });

  it('returns an empty array when Firestore throws an error', async () => {
    (collection as Mock).mockReturnValue({});
    (query as Mock).mockReturnValue({});
    (getDocs as Mock).mockRejectedValue(new Error('Firestore error'));

    const result = await getAllPlants();

    expect(result).toEqual([]);
  });

  it('normalizes missing fields to safe defaults', async () => {
    (collection as Mock).mockReturnValue({});
    (query as Mock).mockReturnValue({});

    const mockDocs = [
      {
        id: '123',
        data: () => ({
          // name missing
          // species missing
        }),
      },
    ];

    (getDocs as Mock).mockResolvedValue({ docs: mockDocs });

    const result = await getAllPlants();

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
