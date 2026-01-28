import { render, screen } from '@testing-library/react';
import SpeciesListItem from './SpeciesListItem';
import { describe, it, expect } from 'vitest';

describe('SpeciesListItem', () => {
  it('renders all fields correctly', () => {
    render(
      <SpeciesListItem
        family="Asparagaceae"
        commonName="Snake Plant"
        description="A very resilient plant."
        tags={['low-maintenance', 'air-purifying']}
        imageUrl="https://example.com/snake.jpg"
      />
    );

    expect(screen.getByText('Asparagaceae')).toBeInTheDocument();
    expect(screen.getByText('Snake Plant')).toBeInTheDocument();
    expect(screen.getByText('A very resilient plant.')).toBeInTheDocument();

    expect(screen.getByText('low-maintenance')).toBeInTheDocument();
    expect(screen.getByText('air-purifying')).toBeInTheDocument();

    const img = screen.getByAltText('Snake Plant');
    expect(img).toHaveAttribute('src', 'https://example.com/snake.jpg');
  });

  it('uses fallbacks when props are missing', () => {
    render(
      <SpeciesListItem
        family=""
        commonName=""
        description="A plant with missing data."
        tags={[]}
        imageUrl=""
      />
    );

    expect(screen.getByText('Unknown family')).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();

    expect(screen.getByText('A plant with missing data.')).toBeInTheDocument();

    const img = screen.getByAltText('plant image');
    expect(img).toHaveAttribute(
      'src',
      'https://larchcottage.co.uk/wp-content/uploads/2024/05/placeholder.jpg'
    );
  });

  it('renders the correct number of tags', () => {
    const tags = ['drought-tolerant', 'indestructible', 'air-purifying'];

    render(
      <SpeciesListItem
        family="Asparagaceae"
        commonName="Snake Plant"
        description="A plant."
        tags={tags}
        imageUrl="https://example.com/snake.jpg"
      />
    );

    tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });
});
