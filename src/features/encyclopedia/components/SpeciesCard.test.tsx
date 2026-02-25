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

    expect(screen.getByAltText('Snake Plant')).toHaveAttribute(
      'src',
      'https://example.com/plant.jpg'
    );
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

    expect(screen.getByAltText('Plant Image')).toHaveAttribute(
      'src',
      'https://larchcottage.co.uk/wp-content/uploads/2024/05/placeholder.jpg'
    );
    expect(screen.getByText('Unknown Family')).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
});
