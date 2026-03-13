import { render, screen } from '@testing-library/react';
import SpeciesDetailsHeader from './SpeciesDetailsHeader';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

describe('SpeciesDetailsHeader', () => {
  it('renders common name, family and scientific name', () => {
    render(
      <BrowserRouter>
        <SpeciesDetailsHeader
          commonName="Snake Plant"
          family="Asparagaceae"
          scientificName="Sansevieria trifasciata"
        />
      </BrowserRouter>
    );

    expect(screen.getByText('Asparagaceae')).toBeInTheDocument();
    expect(
      screen.getByText('Snake Plant (Sansevieria trifasciata)')
    ).toBeInTheDocument();
  });

  it('renders back button', () => {
    render(
      <BrowserRouter>
        <SpeciesDetailsHeader
          commonName="Snake Plant"
          family="Asparagaceae"
          scientificName="Sansevieria trifasciata"
        />
      </BrowserRouter>
    );

    const backButton = screen.getByRole('button', {
      name: /back to encyclopedia/i,
    });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveAccessibleName('Back to Encyclopedia');
  });
});
