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

    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://example.com/plant.jpg');
    expect(img.alt).toBe('Snake Plant image');

    expect(screen.getByText('Asparagaceae')).toBeInTheDocument();
    expect(screen.getByText('Snake Plant')).toBeInTheDocument();
  });

  it('icon button is hidden by default', () => {
    render(
      <MemoryRouter>
        <SpeciesCard family="Asparagaceae" commonName="Snake Plant" id="1" />
      </MemoryRouter>
    );

    const button = screen.getByTestId('icon-container');

    expect(button).toHaveClass('opacity-0');
  });

  it('does not nest icon button inside species link', () => {
    render(
      <MemoryRouter>
        <SpeciesCard family="Asparagaceae" commonName="Snake Plant" id="1" />
      </MemoryRouter>
    );

    const links = screen.getAllByRole('link');
    const addButton = screen.getByRole('button', {
      name: /add snake plant to collection/i,
    });

    links.forEach((link) => {
      expect(link).not.toContainElement(addButton);
    });
  });

  it('handles missing props gracefully', () => {
    render(
      <MemoryRouter>
        <SpeciesCard id="1" />
      </MemoryRouter>
    );

    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('/public/images/placeholder.jpg');
    expect(img.alt).toBe('No photo available');

    expect(screen.getByText('Unknown Family')).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
});
