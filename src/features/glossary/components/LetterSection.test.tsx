import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LetterSection from './LetterSection';

describe('LetterSection', () => {
  it('renders the letter and terms correctly', () => {
    const mockTerms = [
      {
        id: '1',
        term: 'Aerial roots',
        definition: 'Roots that grow above the ground.',
        images: [
          {
            url: 'https://example.com/image1.jpg',
            caption: 'Aerial roots image',
            shape: '1:1' as const,
          },
        ],
      },
    ];

    render(<LetterSection letter="A" terms={mockTerms} />);

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('Aerial roots')).toBeInTheDocument();
    expect(
      screen.getByText('Roots that grow above the ground.')
    ).toBeInTheDocument();
    expect(screen.getByAltText('Aerial roots image')).toBeInTheDocument();
  });

  it('renders multiple terms correctly', () => {
    const mockTerms = [
      {
        id: '1',
        term: 'Aerial roots',
        definition: 'Roots that grow above the ground.',
        images: [
          {
            url: 'https://example.com/image1.jpg',
            caption: 'Aerial roots image',
            shape: '1:1' as const,
          },
        ],
      },
      {
        id: '2',
        term: 'Chlorophyll',
        definition: 'Green pigment in plants.',
        images: [
          {
            url: 'https://example.com/image2.jpg',
            caption: 'Chlorophyll image',
            shape: '2:3' as const,
          },
        ],
      },
    ];

    render(<LetterSection letter="A" terms={mockTerms} />);

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('Aerial roots')).toBeInTheDocument();
    expect(
      screen.getByText('Roots that grow above the ground.')
    ).toBeInTheDocument();
    expect(screen.getByAltText('Aerial roots image')).toBeInTheDocument();

    expect(screen.getByText('Chlorophyll')).toBeInTheDocument();
    expect(screen.getByText('Green pigment in plants.')).toBeInTheDocument();
    expect(screen.getByAltText('Chlorophyll image')).toBeInTheDocument();
  });
});
