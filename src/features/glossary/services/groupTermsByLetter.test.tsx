import { describe, expect, it } from 'vitest';
import { groupTermsByLetter } from './groupTermsByLetter';

describe('groupTermsByLetter', () => {
  it('should group terms by their first letter', () => {
    const terms = [
      {
        id: 'C-chlorophyll',
        term: 'Chlorophyll',
        definition: 'Green pigment in plants',
        images: [
          {
            url: 'https://example.com/chlorophyll.jpg',
            caption: 'Chlorophyll in leaves',
            shape: '1:1' as const,
          },
        ],
      },
      {
        id: 'E-Etiolation',
        term: 'Etiolation',
        definition:
          'The process of plants becoming pale and elongated due to lack of light',
        images: [
          {
            url: 'https://example.com/etiolation.jpg',
            caption: 'Etiolated plant',
            shape: '1:1' as const,
          },
        ],
      },
      {
        id: 'I-Inflorescence',
        term: 'Inflorescence',
        definition: 'The arrangement of flowers on a plant',
        images: [
          {
            url: 'https://example.com/inflorescence.jpg',
            caption: 'Inflorescence on a plant',
            shape: '1:1' as const,
          },
        ],
      },
    ];

    const result = groupTermsByLetter(terms);

    expect(result).toEqual({
      C: [terms[0]],
      E: [terms[1]],
      I: [terms[2]],
    });
  });

  it('should return an empty object when given an empty array', () => {
    const result = groupTermsByLetter([]);
    expect(result).toEqual({});
  });

  it('should handle terms with the same first letter', () => {
    const terms = [
      {
        id: 'A-AerialRoots',
        term: 'Aerial Roots',
        definition: 'Roots that grow above the ground',
        images: [
          {
            url: 'https://example.com/aerial-roots.jpg',
            caption: 'Aerial roots on a plant',
            shape: '1:1' as const,
          },
        ],
      },
      {
        id: 'A-Absorption',
        term: 'Absorption',
        definition: 'The process of taking in water and nutrients',
        images: [
          {
            url: 'https://example.com/absorption.jpg',
            caption: 'Absorption in plant cells',
            shape: '1:1' as const,
          },
        ],
      },
    ];

    const result = groupTermsByLetter(terms);

    expect(result).toEqual({
      A: [terms[0], terms[1]],
    });
  });
});
