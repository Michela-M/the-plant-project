import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@services/firebase';
import { getAllSpecies } from './getAllSpecies';

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

describe('getAllSpecies', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a normalized list of species when documents exist', async () => {
    const mockCollectionRef = {};
    const mockQueryRef = {};

    (collection as Mock).mockReturnValue(mockCollectionRef);
    (query as Mock).mockReturnValue(mockQueryRef);

    const mockDocs = [
      {
        data: () => ({
          commonName: 'Aloe Vera',
          family: 'Asphodelaceae',
          description: 'A succulent plant species of the genus Aloe.',
          tags: ['succulent', 'medicinal'],
          image: 'https://example.com/aloe.jpg',
        }),
        id: '1',
      },
    ];

    (getDocs as Mock).mockResolvedValue({ docs: mockDocs });

    const result = await getAllSpecies();

    expect(collection).toHaveBeenCalledWith(db, 'species');
    expect(orderBy).toHaveBeenCalledWith('commonName', 'asc');
    expect(query).toHaveBeenCalledWith(
      mockCollectionRef,
      orderBy('commonName', 'asc')
    );
    expect(getDocs).toHaveBeenCalledWith(mockQueryRef);

    expect(result).toEqual([
      {
        id: '1',
        commonName: 'Aloe Vera',
        family: 'Asphodelaceae',
        description: 'A succulent plant species of the genus Aloe.',
        tags: ['succulent', 'medicinal'],
        image: 'https://example.com/aloe.jpg',
      },
    ]);
  });

  it('returns an empty array when no documents exist', async () => {
    (collection as Mock).mockReturnValue({});
    (query as Mock).mockReturnValue({});
    (getDocs as Mock).mockResolvedValue({ docs: [] });

    const result = await getAllSpecies();

    expect(result).toEqual([]);
  });

  it('handles missing fields gracefully', async () => {
    const mockCollectionRef = {};
    const mockQueryRef = {};

    (collection as Mock).mockReturnValue(mockCollectionRef);
    (query as Mock).mockReturnValue(mockQueryRef);

    const mockDocs = [
      {
        data: () => ({
          commonName: 'Aloe Vera',
          // family is missing
          description: 'A succulent plant species of the genus Aloe.',
          // tags is missing
          image: 'https://example.com/aloe.jpg',
        }),
        id: '1',
      },
    ];

    (getDocs as Mock).mockResolvedValue({ docs: mockDocs });

    const result = await getAllSpecies();

    expect(result).toEqual([
      {
        id: '1',
        commonName: 'Aloe Vera',
        family: '', // default value for missing field
        description: 'A succulent plant species of the genus Aloe.',
        tags: [], // default value for missing field
        image: 'https://example.com/aloe.jpg',
      },
    ]);
  });
});
