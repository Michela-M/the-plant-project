import { render, screen } from '@testing-library/react';
import PlantCard from './PlantCard';
import { describe, it, expect } from 'vitest';

describe('PlantCard component', () => {
  it('renders image, family, and common name', () => {
    render(
      <PlantCard
        imageUrl="https://example.com/plant.jpg"
        family="Asparagaceae"
        commonName="Snake Plant"
      />
    );

    expect(screen.getByAltText('Snake Plant')).toHaveAttribute(
      'src',
      'https://example.com/plant.jpg'
    );
    expect(screen.getByText('Asparagaceae')).toBeInTheDocument();
    expect(screen.getByText('Snake Plant')).toBeInTheDocument();
  });

  it('handles missing props gracefully', () => {
    render(<PlantCard />);

    expect(screen.getByAltText('Plant Image')).toHaveAttribute(
      'src',
      'https://larchcottage.co.uk/wp-content/uploads/2024/05/placeholder.jpg'
    );
    expect(screen.getByText('Family Unknown')).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
});
