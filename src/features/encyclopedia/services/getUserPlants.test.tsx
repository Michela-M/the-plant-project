import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserPlants } from './getUserPlants';
import type { Mock } from 'vitest';
import { getDocs, collection, where, query } from 'firebase/firestore';

vi.mock('firebase/firestore', () => ({
  getDocs: vi.fn(),
  collection: vi.fn(),
  where: vi.fn(),
  query: vi.fn(),
}));

vi.mock('@services/firebase', () => ({
  db: {},
}));

describe('getUserPlants', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return user plants for a valid user ID and species ID', async () => {
    const mockSnapshot = {
      docs: [
        {
          id: 'plant1',
          data: () => ({
            name: 'My Aloe',
            speciesName: 'Aloe Vera',
            imageUrl: 'https://example.com/myaloe.jpg',
          }),
        },
        {
          id: 'plant2',
          data: () => ({
            name: 'Second Aloe',
            speciesName: 'Aloe Vera',
            imageUrl: '',
          }),
        },
      ],
    };

    (collection as Mock).mockReturnValue('mockCollectionRef');
    (where as Mock).mockReturnValue('mockWhereClause');
    (query as Mock).mockReturnValue('mockQuery');
    (getDocs as Mock).mockResolvedValue(mockSnapshot);

    const result = await getUserPlants('user123', 'species456');

    expect(collection).toHaveBeenCalledWith({}, 'users/user123/plants');
    expect(where).toHaveBeenCalledWith('speciesId', '==', 'species456');
    expect(query).toHaveBeenCalledWith('mockCollectionRef', 'mockWhereClause');
    expect(getDocs).toHaveBeenCalledWith('mockQuery');

    expect(result).toEqual([
      {
        id: 'plant1',
        name: 'My Aloe',
        speciesName: 'Aloe Vera',
        imageUrl: 'https://example.com/myaloe.jpg',
      },
      {
        id: 'plant2',
        name: 'Second Aloe',
        speciesName: 'Aloe Vera',
        imageUrl: '',
      },
    ]);
  });
});
