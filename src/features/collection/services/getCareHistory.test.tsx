import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@services/firebase';
import { getCareHistory } from './getCareHistory';

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

describe('getCareHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a normalized list of care entries when documents exist', async () => {
    const mockCollectionRef = {};
    const mockQueryRef = {};

    (collection as Mock).mockReturnValue(mockCollectionRef);
    (query as Mock).mockReturnValue(mockQueryRef);

    const mockDocs = [
      {
        data: () => ({
          date: {
            toDate: () => new Date('2024-01-01T10:00:00Z'),
          },
          careType: 'watering',
          notes: 'Watered the plant thoroughly.',
          otherCareType: '',
        }),
        id: 'entry1',
      },
    ];

    (getDocs as Mock).mockResolvedValue({ docs: mockDocs });

    const result = await getCareHistory('plant123', 'test-user');

    expect(collection).toHaveBeenCalledWith(
      db,
      'users/test-user/plants/plant123/careEntries'
    );
    expect(orderBy).toHaveBeenCalledWith('date', 'desc');
    expect(query).toHaveBeenCalledWith(
      mockCollectionRef,
      orderBy('date', 'desc')
    );
    expect(getDocs).toHaveBeenCalledWith(mockQueryRef);

    expect(result).toEqual([
      {
        id: 'entry1',
        date: new Date('2024-01-01T10:00:00Z'),
        careType: 'watering',
        notes: 'Watered the plant thoroughly.',
        otherCareType: '',
      },
    ]);
  });

  it('returns an empty array when no care entries exist', async () => {
    (collection as Mock).mockReturnValue({});
    (query as Mock).mockReturnValue({});
    (getDocs as Mock).mockResolvedValue({ docs: [] });

    const result = await getCareHistory('plant123', 'test-user');

    expect(result).toEqual([]);
  });

  it('throws an error when Firestore fails', async () => {
    (collection as Mock).mockReturnValue({});
    (query as Mock).mockReturnValue({});
    (getDocs as Mock).mockRejectedValue(new Error('Firestore error'));

    await expect(getCareHistory('plant123', 'test-user')).rejects.toThrow(
      'Firestore error'
    );
  });

  it('handles documents with missing optional fields', async () => {
    const mockCollectionRef = {};
    const mockQueryRef = {};

    (collection as Mock).mockReturnValue(mockCollectionRef);
    (query as Mock).mockReturnValue(mockQueryRef);

    const mockDocs = [
      {
        data: () => ({
          date: {
            toDate: () => new Date('2024-01-01T10:00:00Z'),
          },
          careType: 'fertilizing',
        }),
        id: 'entry2',
      },
    ];

    (getDocs as Mock).mockResolvedValue({ docs: mockDocs });

    const result = await getCareHistory('plant123', 'test-user');

    expect(result).toEqual([
      {
        id: 'entry2',
        date: new Date('2024-01-01T10:00:00Z'),
        careType: 'fertilizing',
        notes: '',
        otherCareType: '',
      },
    ]);
  });
});
