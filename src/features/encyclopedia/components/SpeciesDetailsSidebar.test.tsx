// renders image preview with correct src and alt text
// renders other names and plant type
// renders characteristics with correct labels and values
// renders similar species section with SimilarSpecies components
// shows placeholder image if no image is provided
// shows "No similar species listed." if similarSpecies array is empty

import { render, screen } from '@testing-library/react';
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

  it('renders image preview with correct src and alt text', () => {
    render(<SpeciesDetailsSidebar speciesDetails={mockSpeciesDetails} />);
    const image = screen.getByRole('img', { name: /aloe vera image/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/aloe.jpg');
  });

  it('renders other names and plant type', () => {
    render(<SpeciesDetailsSidebar speciesDetails={mockSpeciesDetails} />);
    expect(
      screen.getByText(/other names: medicinal aloe/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/plant type: succulent/i)).toBeInTheDocument();
  });

  it('renders only applicable characteristic badges', () => {
    render(<SpeciesDetailsSidebar speciesDetails={mockSpeciesDetails} />);
    expect(screen.getByLabelText('difficulty')).toBeInTheDocument();
    expect(screen.getByLabelText('toxicity')).toBeInTheDocument();
    expect(screen.queryByLabelText('maintenance')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('light')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('pruning')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('propagation')).not.toBeInTheDocument();
  });

  it('renders similar species section with SimilarSpecies components', () => {
    render(<SpeciesDetailsSidebar speciesDetails={mockSpeciesDetails} />);
    expect(
      screen.getByRole('heading', { name: 'Similar Species' })
    ).toBeInTheDocument();
    expect(screen.getAllByTestId('similar-species-item')).toHaveLength(2);
  });

  it('shows placeholder image if no image is provided', () => {
    const speciesWithoutImage = { ...mockSpeciesDetails, image: '' };
    render(<SpeciesDetailsSidebar speciesDetails={speciesWithoutImage} />);
    const image = screen.getByRole('img') as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.alt).toBe('No photo available for Aloe Vera');
    expect(image.src).toContain('/public/images/placeholder.jpg');
  });

  it('shows "No similar species listed." if similarSpecies array is empty', () => {
    const speciesWithoutSimilar = { ...mockSpeciesDetails, similarSpecies: [] };
    render(<SpeciesDetailsSidebar speciesDetails={speciesWithoutSimilar} />);
    expect(screen.getByText(/no similar species listed/i)).toBeInTheDocument();
  });
});
