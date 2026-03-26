import { render, screen } from '@testing-library/react';
import SpeciesCard from './SpeciesCard';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

describe('SpeciesCard component', () => {
  it('renders image, family, and common name', () => {
    render(
      <MemoryRouter>
        <SpeciesCard
          imageUrl="https://example.com/plant.jpg"
          family="Asparagaceae"
          commonName="Snake Plant"
          id="1"
        />
      </MemoryRouter>
    );

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/plant.jpg');
    expect(img).toHaveAttribute('alt', 'Snake Plant image');

    expect(screen.getByText('Asparagaceae')).toBeInTheDocument();
    expect(screen.getByText('Snake Plant')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('uses the species details route for both links', () => {
    render(
      <MemoryRouter>
        <SpeciesCard family="Asparagaceae" commonName="Snake Plant" id="1" />
      </MemoryRouter>
    );

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(2);
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', '/species/1');
    });
  });

  it('handles missing props gracefully', () => {
    render(
      <MemoryRouter>
        <SpeciesCard id="1" />
      </MemoryRouter>
    );

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/src/assets/images/placeholder.jpg');
    expect(img).toHaveAttribute('alt', 'No photo available');

    expect(screen.getByText('Unknown Family')).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
});
