import { render, screen } from '@testing-library/react';
import SpeciesDetailsMainContent from './SpeciesDetailsMainContent';
import type { SpeciesDetailsData } from '../types/speciesDetails';
import { describe, it, expect } from 'vitest';

describe('SpeciesDetailsMainContent', () => {
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

  it('renders description', () => {
    render(<SpeciesDetailsMainContent speciesDetails={mockSpeciesDetails} />);
    expect(
      screen.getByText(/a succulent plant species of the genus aloe/i)
    ).toBeInTheDocument();
  });

  it('renders care sections with correct headings and content', () => {
    render(<SpeciesDetailsMainContent speciesDetails={mockSpeciesDetails} />);
    expect(
      screen.getByRole('heading', { name: /watering/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/water every 3 weeks/i)).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: /light/i })).toBeInTheDocument();
    expect(screen.getByText(/bright indirect light/i)).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /humidity/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/low humidity/i)).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /temperature/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/15-25°c/i)).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /soil & repotting/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/well-draining soil/i)).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /fertilizing/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/fertilize once a month/i)).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /pests & problems/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/watch for mealybugs/i)).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /propagation/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/propagate via offsets/i)).toBeInTheDocument();
  });
});
