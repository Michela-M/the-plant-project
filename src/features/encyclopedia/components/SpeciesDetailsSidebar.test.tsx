import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SpeciesDetailsSidebar from './SpeciesDetailsSidebar';
import type { SpeciesDetailsData } from '../types/speciesDetails';
import { describe, it, expect, vi } from 'vitest';

vi.mock('./SimilarSpecies', () => ({
  default: ({ speciesId }: { speciesId: string }) => (
    <div data-testid="similar-species-item">
      Mock similar species {speciesId}
    </div>
  ),
}));

describe('SpeciesDetailsSidebar', () => {
  const mockSpeciesDetails: SpeciesDetailsData = {
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
  };

  const mockUserPlants = [
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
  ];

  it('renders image preview with correct src and alt text', () => {
    render(
      <MemoryRouter>
        <SpeciesDetailsSidebar
          speciesDetails={mockSpeciesDetails}
          userPlants={[]}
        />
      </MemoryRouter>
    );
    const image = screen.getByRole('img', { name: /aloe vera image/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/aloe.jpg');
  });

  it('renders other names and plant type', () => {
    render(
      <MemoryRouter>
        <SpeciesDetailsSidebar
          speciesDetails={mockSpeciesDetails}
          userPlants={[]}
        />
      </MemoryRouter>
    );
    expect(
      screen.getByText(/other names: medicinal aloe/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/plant type: succulent/i)).toBeInTheDocument();
  });

  it('renders multiple other names and types', () => {
    const details = {
      ...mockSpeciesDetails,
      otherNames: ['Medicinal Aloe', 'Burn Plant'],
      type: ['Succulent', 'Herb'],
    };
    render(
      <MemoryRouter>
        <SpeciesDetailsSidebar speciesDetails={details} userPlants={[]} />
      </MemoryRouter>
    );
    expect(
      screen.getByText(/other names: medicinal aloe, burn plant/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/plant type: succulent, herb/i)
    ).toBeInTheDocument();
  });

  it('renders only applicable characteristic badges', () => {
    render(
      <MemoryRouter>
        <SpeciesDetailsSidebar
          speciesDetails={mockSpeciesDetails}
          userPlants={[]}
        />
      </MemoryRouter>
    );
    expect(screen.getByTestId('icon-difficulty')).toBeInTheDocument();
    expect(screen.getByTestId('icon-toxicity')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-maintenance')).not.toBeInTheDocument();
    expect(screen.queryByTestId('icon-light')).not.toBeInTheDocument();
    expect(screen.queryByTestId('icon-pruning')).not.toBeInTheDocument();
    expect(screen.queryByTestId('icon-propagation')).not.toBeInTheDocument();
  });

  it('renders all characteristic badges when values are non-zero', () => {
    const details = {
      ...mockSpeciesDetails,
      characteristics: {
        difficulty: 1,
        toxicity: 1,
        maintenance: 1,
        light: 1,
        pruning: 1,
        propagation: 1,
      },
    };
    render(
      <MemoryRouter>
        <SpeciesDetailsSidebar speciesDetails={details} userPlants={[]} />
      </MemoryRouter>
    );
    expect(screen.getByTestId('icon-difficulty')).toBeInTheDocument();
    expect(screen.getByTestId('icon-toxicity')).toBeInTheDocument();
    expect(screen.getByTestId('icon-maintenance')).toBeInTheDocument();
    expect(screen.getByTestId('icon-light')).toBeInTheDocument();
    expect(screen.getByTestId('icon-pruning')).toBeInTheDocument();
    expect(screen.getByTestId('icon-propagation')).toBeInTheDocument();
  });

  it('renders similar species section with SimilarSpecies components', () => {
    render(
      <MemoryRouter>
        <SpeciesDetailsSidebar
          speciesDetails={mockSpeciesDetails}
          userPlants={[]}
        />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('heading', { name: 'Similar Species' })
    ).toBeInTheDocument();
    expect(screen.getAllByTestId('similar-species-item')).toHaveLength(2);
  });

  it('shows placeholder image if no image is provided', () => {
    const speciesWithoutImage = { ...mockSpeciesDetails, image: '' };
    render(
      <SpeciesDetailsSidebar
        speciesDetails={speciesWithoutImage}
        userPlants={[]}
      />
    );
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect((image as HTMLImageElement).alt).toBe(
      'No photo available for Aloe Vera'
    );
    expect((image as HTMLImageElement).src).toContain(
      '/images/placeholder.jpg'
    );
  });

  it('shows "No similar species listed." if similarSpecies array is empty', () => {
    const speciesWithoutSimilar = { ...mockSpeciesDetails, similarSpecies: [] };
    render(
      <SpeciesDetailsSidebar
        speciesDetails={speciesWithoutSimilar}
        userPlants={[]}
      />
    );
    expect(screen.getByText(/no similar species listed/i)).toBeInTheDocument();
  });

  it('renders userPlants section with images, names, and links', () => {
    render(
      <MemoryRouter>
        <SpeciesDetailsSidebar
          speciesDetails={mockSpeciesDetails}
          userPlants={mockUserPlants}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /your plants/i })
    ).toBeInTheDocument();
    expect(screen.getByText('My Aloe')).toBeInTheDocument();
    expect(screen.getByText('Second Aloe')).toBeInTheDocument();
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThanOrEqual(3);
    const myAloeImg = images.find((img) => (img as HTMLImageElement).alt.includes('My Aloe'));
    expect(myAloeImg).toHaveAttribute('src', 'https://example.com/myaloe.jpg');
    const secondAloeImg = images.find(
      (img) => (img as HTMLImageElement).alt === 'No photo available'
    );
    expect(secondAloeImg).toHaveAttribute(
      'src',
      expect.stringContaining('/images/placeholder.jpg')
    );
    expect(screen.getByRole('link', { name: /my aloe/i })).toHaveAttribute(
      'href',
      '/plants/plant1'
    );
    expect(screen.getByRole('link', { name: /second aloe/i })).toHaveAttribute(
      'href',
      '/plants/plant2'
    );
  });

  it('does not render userPlants section if userPlants is empty', () => {
    render(
      <SpeciesDetailsSidebar
        speciesDetails={mockSpeciesDetails}
        userPlants={[]}
      />
    );
    expect(
      screen.queryByRole('heading', { name: /your plants/i })
    ).not.toBeInTheDocument();
  });

  it('renders all headings for accessibility', () => {
    render(
      <MemoryRouter>
        <SpeciesDetailsSidebar
          speciesDetails={mockSpeciesDetails}
          userPlants={mockUserPlants}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /characteristics/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /similar species/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /your plants/i })
    ).toBeInTheDocument();
  });

  it('handles empty otherNames and type arrays gracefully', () => {
    const details = { ...mockSpeciesDetails, otherNames: [], type: [] };
    render(
      <MemoryRouter>
        <SpeciesDetailsSidebar speciesDetails={details} userPlants={[]} />
      </MemoryRouter>
    );
    expect(screen.getByText(/other names:/i)).toBeInTheDocument();
    expect(screen.getByText(/plant type:/i)).toBeInTheDocument();
  });
});
