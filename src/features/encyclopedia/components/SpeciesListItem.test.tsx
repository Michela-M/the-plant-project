import { render, screen } from '@testing-library/react';
import SpeciesListItem from './SpeciesListItem';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

describe('SpeciesListItem', () => {
  it('renders all fields correctly', () => {
    render(
      <MemoryRouter>
        <SpeciesListItem
          family="Asparagaceae"
          commonName="Snake Plant"
          description="A very resilient plant."
          tags={['low-maintenance', 'air-purifying']}
          imageUrl="https://example.com/snake.jpg"
          id="1"
        />
      </MemoryRouter>
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
      <MemoryRouter>
        <SpeciesListItem
          family=""
          commonName=""
          description="A plant with missing data."
          tags={[]}
          imageUrl=""
          id="1"
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Unknown Family')).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();

    expect(screen.getByText('A plant with missing data.')).toBeInTheDocument();

    const img = screen.getByAltText('Plant Image');
    expect(img).toHaveAttribute('src', '/public/images/placeholder.jpg');
  });

  it('icon button is hidden by default', () => {
    render(
      <MemoryRouter>
        <SpeciesListItem
          family="Asparagaceae"
          commonName="Snake Plant"
          description="A very resilient plant."
          tags={['low-maintenance', 'air-purifying']}
          imageUrl="https://example.com/snake.jpg"
          id="1"
        />
      </MemoryRouter>
    );

    const button = screen.getByTestId('icon-container');

    expect(button).toHaveClass('opacity-0');
  });

  it('renders the correct number of tags', () => {
    const tags = ['drought-tolerant', 'indestructible', 'air-purifying'];

    render(
      <MemoryRouter>
        <SpeciesListItem
          family="Asparagaceae"
          commonName="Snake Plant"
          description="A plant."
          tags={tags}
          imageUrl="https://example.com/snake.jpg"
          id="1"
        />
      </MemoryRouter>
    );

    tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('does not nest icon button inside species link', () => {
    render(
      <MemoryRouter>
        <SpeciesListItem
          family="Asparagaceae"
          commonName="Snake Plant"
          description="A plant."
          tags={['air-purifying']}
          imageUrl="https://example.com/snake.jpg"
          id="1"
        />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: /snake plant/i });
    const addButton = screen.getByRole('button', {
      name: /add snake plant to collection/i,
    });

    expect(link).not.toContainElement(addButton);
  });
});
