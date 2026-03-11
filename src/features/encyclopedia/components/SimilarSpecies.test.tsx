import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SimilarSpecies from './SimilarSpecies';

const { mockGetSpeciesDetails, mockShowError } = vi.hoisted(() => ({
  mockGetSpeciesDetails: vi.fn(),
  mockShowError: vi.fn(),
}));

vi.mock('../services/getSpeciesDetails', () => ({
  getSpeciesDetails: mockGetSpeciesDetails,
}));

vi.mock('@context/toast/useToast', () => ({
  useToast: () => ({ showError: mockShowError }),
}));

describe('SimilarSpecies', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders fallback content before species details load', () => {
    mockGetSpeciesDetails.mockReturnValueOnce(new Promise(() => {}));

    render(
      <MemoryRouter>
        <SimilarSpecies speciesId="species-1" />
      </MemoryRouter>
    );

    expect(screen.getByText('Unknown Family')).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();

    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('/public/images/placeholder.jpg');
    expect(img.alt).toBe('No photo available');
  });

  it('renders fetched similar species details and tags', async () => {
    mockGetSpeciesDetails.mockResolvedValueOnce({
      id: 'species-2',
      commonName: 'Bird of Paradise',
      scientificName: 'Strelitzia reginae',
      family: 'Strelitziaceae',
      description: 'Test description',
      tags: ['Pet Friendly', 'Statement Plant'],
      image: 'https://example.com/bop.jpg',
      otherNames: [],
      type: [],
      similarSpecies: [],
      characteristics: {
        difficulty: 2,
        toxicity: 0,
        maintenance: 2,
        light: 3,
        pruning: 2,
        propagation: 1,
      },
      watering: { text: 'Water weekly', images: [] },
      light: { text: 'Bright direct', images: [] },
      humidity: { text: 'High humidity', images: [] },
      temperature: { text: '18-27C', images: [] },
      soilAndRepotting: { text: 'Chunky mix', images: [] },
      fertilizing: { text: 'Biweekly', images: [] },
      pestsAndProblems: { text: 'Mealybugs', images: [] },
      propagation: { text: 'Division', images: [] },
    });

    render(
      <MemoryRouter>
        <SimilarSpecies speciesId="species-2" />
      </MemoryRouter>
    );

    expect(mockGetSpeciesDetails).toHaveBeenCalledWith('species-2');

    expect(await screen.findByText('Strelitziaceae')).toBeInTheDocument();
    expect(screen.getByText('Bird of Paradise')).toBeInTheDocument();
    expect(screen.getByText('Pet Friendly')).toBeInTheDocument();
    expect(screen.getByText('Statement Plant')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/species/species-2'
    );

    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://example.com/bop.jpg');
    expect(img.alt).toBe('Bird of Paradise (Strelitzia reginae) image');
  });

  it('shows toast error when fetching species details fails', async () => {
    mockGetSpeciesDetails.mockRejectedValueOnce(new Error('Firestore error'));

    render(
      <MemoryRouter>
        <SimilarSpecies speciesId="species-3" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Firestore error');
    });
  });
});
