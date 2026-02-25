import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSpeciesDetails } from './getSpeciesDetails';
import { doc, getDoc } from 'firebase/firestore';
import type { Mock } from 'vitest';

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
}));

vi.mock('@services/firebase', () => ({
  db: {},
}));

describe('getSpeciesDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return species details for a valid species ID', async () => {
    const mockDocSnap = {
      id: '1',
      exists: () => true,
      data: () => ({
        commonName: 'Aloe Vera',
        scientificName: 'Aloe barbadensis miller',
        family: 'Asphodelaceae',
        description: 'A succulent plant species of the genus Aloe.',
        otherNames: ['Medicinal Aloe'],
        type: ['Succulent'],
        characteristics: {
          difficulty: 1,
          toxicity: 2,
          maintenance: 0,
          light: 0,
          pruning: 0,
          propagation: 0,
        },
        watering: { text: 'Water every 3 weeks', images: [] },
        light: { text: 'Bright indirect light', images: [] },
        humidity: { text: 'Low humidity', images: [] },
        temperature: { text: '15-25°C', images: [] },
        soilAndRepotting: { text: 'Well-draining soil', images: [] },
        fertilizing: { text: 'Fertilize once a month', images: [] },
        pestsAndProblems: { text: 'Watch for mealybugs', images: [] },
        propagation: { text: 'Propagate via offsets', images: [] },
        image: 'https://example.com/aloe.jpg',
        tags: ['succulent', 'medicinal'],
        similarSpecies: ['2', '3'],
      }),
    };

    (doc as Mock).mockReturnValue('mockDocRef');
    (getDoc as Mock).mockResolvedValue(mockDocSnap);

    const result = await getSpeciesDetails('1');

    expect(result).toEqual({
      id: '1',
      commonName: 'Aloe Vera',
      scientificName: 'Aloe barbadensis miller',
      family: 'Asphodelaceae',
      description: 'A succulent plant species of the genus Aloe.',
      otherNames: ['Medicinal Aloe'],
      type: ['Succulent'],
      characteristics: {
        difficulty: 1,
        toxicity: 2,
        maintenance: 0,
        light: 0,
        pruning: 0,
        propagation: 0,
      },
      watering: { text: 'Water every 3 weeks', images: [] },
      light: { text: 'Bright indirect light', images: [] },
      humidity: { text: 'Low humidity', images: [] },
      temperature: { text: '15-25°C', images: [] },
      soilAndRepotting: { text: 'Well-draining soil', images: [] },
      fertilizing: { text: 'Fertilize once a month', images: [] },
      pestsAndProblems: { text: 'Watch for mealybugs', images: [] },
      propagation: { text: 'Propagate via offsets', images: [] },
      image: 'https://example.com/aloe.jpg',
      tags: ['succulent', 'medicinal'],
      similarSpecies: ['2', '3'],
    });
  });

  it('should return null for a non-existent species ID', async () => {
    const mockDocSnap = {
      id: '2',
      exists: () => false,
    };

    (doc as Mock).mockReturnValue('mockDocRef');
    (getDoc as Mock).mockResolvedValue(mockDocSnap);

    const result = await getSpeciesDetails('2');

    expect(result).toBeNull();
  });

  it('should throw an error if there is an issue fetching the document', async () => {
    (doc as Mock).mockReturnValue('mockDocRef');
    (getDoc as Mock).mockRejectedValue(new Error('Firestore error'));

    await expect(getSpeciesDetails('3')).rejects.toThrow('Firestore error');
  });
});
