import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PlantCard from './PlantCard';

describe('PlantCard component', () => {
  it('renders plant information correctly', () => {
    render(
      <PlantCard
        plant={{
          imageUrl: 'https://example.com/plant.jpg',
          commonName: 'Snake Plant',
          name: 'Sansevieria trifasciata',
        }}
      />
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
      <PlantCard
        plant={{
          name: 'Sansevieria trifasciata',
        }}
      />
    );

    expect(screen.getByAltText('Plant Image')).toHaveAttribute(
      'src',
      'https://larchcottage.co.uk/wp-content/uploads/2024/05/placeholder.jpg'
    );
    expect(screen.getByText('Sansevieria trifasciata')).toBeInTheDocument();
  });
});
