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

    expect(screen.getByAltText('Snake Plant')).toHaveAttribute(
      'src',
      'https://example.com/plant.jpg'
    );
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

    expect(screen.getByAltText('Plant Image')).toHaveAttribute(
      'src',
      'https://larchcottage.co.uk/wp-content/uploads/2024/05/placeholder.jpg'
    );
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
