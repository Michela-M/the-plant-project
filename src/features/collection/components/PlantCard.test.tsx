import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PlantCard from './PlantCard';
import { MemoryRouter } from 'react-router-dom';

describe('PlantCard component', () => {
  it('renders plant information correctly', () => {
    render(
      <MemoryRouter>
        <PlantCard
          plant={{
            id: 'plant-1',
            imageUrl: 'https://example.com/plant.jpg',
            commonName: 'Snake Plant',
            name: 'Sansevieria trifasciata',
          }}
        />
      </MemoryRouter>
    );

    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://example.com/plant.jpg');
    expect(img.alt).toBe('Sansevieria trifasciata image');

    expect(screen.getByText('Snake Plant')).toBeInTheDocument();
    expect(screen.getByText('Sansevieria trifasciata')).toBeInTheDocument();
  });

  it('handles missing image and common name gracefully', () => {
    render(
      <MemoryRouter>
        <PlantCard
          plant={{
            id: 'plant-2',
            name: 'Sansevieria trifasciata',
          }}
        />
      </MemoryRouter>
    );

    const img = screen.getByAltText(
      'No photo available for Sansevieria trifasciata'
    ) as HTMLImageElement;
    expect(img).toHaveAttribute('src', '/images/placeholder.jpg');
    expect(img.alt).toBe('No photo available for Sansevieria trifasciata');

    expect(screen.getByText('Sansevieria trifasciata')).toBeInTheDocument();
  });

  it('handles missing name gracefully', () => {
    render(
      <MemoryRouter>
        <PlantCard
          plant={{
            id: 'plant-4',
            name: '',
            commonName: 'Snake Plant',
          }}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Unnamed Plant')).toBeInTheDocument();
  });

  it('navigates to plant details on click', () => {
    render(
      <MemoryRouter>
        <PlantCard
          plant={{
            id: 'plant-3',
            name: 'Sansevieria trifasciata',
          }}
        />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/plants/plant-3');
  });
});
