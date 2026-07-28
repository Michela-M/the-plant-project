import { db } from '@services/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { getTerms } from './getTerms';

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

describe('getTerms', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a normalized list of terms when documents exist', async () => {
    const mockCollectionRef = {};
    const mockQueryRef = {};

    (collection as Mock).mockReturnValue(mockCollectionRef);
    (query as Mock).mockReturnValue(mockQueryRef);

    const mockDocs = [
      {
        data: () => ({
          term: 'Photosynthesis',
          definition:
            'The process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water.',
        }),
        id: '1',
      },
    ];

    (getDocs as Mock).mockResolvedValue({ docs: mockDocs });

    const result = await getTerms();

    expect(collection).toHaveBeenCalledWith(db, 'glossary');
    expect(orderBy).toHaveBeenCalledWith('term', 'asc');
    expect(query).toHaveBeenCalledWith(
      mockCollectionRef,
      orderBy('term', 'asc')
    );
    expect(getDocs).toHaveBeenCalledWith(mockQueryRef);

    expect(result).toEqual([
      {
        id: '1',
        term: 'Photosynthesis',
        definition:
          'The process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water.',
      },
    ]);
  });

  it('returns an empty array when no documents exist', async () => {
    const mockCollectionRef = {};
    const mockQueryRef = {};

    (collection as Mock).mockReturnValue(mockCollectionRef);
    (query as Mock).mockReturnValue(mockQueryRef);

    (getDocs as Mock).mockResolvedValue({ docs: [] });

    const result = await getTerms();

    expect(collection).toHaveBeenCalledWith(db, 'glossary');
    expect(orderBy).toHaveBeenCalledWith('term', 'asc');
    expect(query).toHaveBeenCalledWith(
      mockCollectionRef,
      orderBy('term', 'asc')
    );
    expect(getDocs).toHaveBeenCalledWith(mockQueryRef);

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
          term: 'Photosynthesis',
          // definition is missing
        }),
        id: '1',
      },
    ];

    (getDocs as Mock).mockResolvedValue({ docs: mockDocs });

    const result = await getTerms();

    expect(result).toEqual([
      {
        id: '1',
        term: 'Photosynthesis',
        definition: '', // default to empty string
      },
    ]);
  });
});
