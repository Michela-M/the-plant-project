import { describe, expect, it } from 'vitest';
import { groupTermsByLetter } from './groupTermsByLetter';

describe('groupTermsByLetter', () => {
  it('should group terms by their first letter', () => {
    const terms = [
      {
        id: 'C-chlorophyll',
        term: 'Chlorophyll',
        definition: 'Green pigment in plants',
      },
      {
        id: 'E-Etiolation',
        term: 'Etiolation',
        definition:
          'The process of plants becoming pale and elongated due to lack of light',
      },
      {
        id: 'I-Inflorescence',
        term: 'Inflorescence',
        definition: 'The arrangement of flowers on a plant',
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
      },
      {
        id: 'A-Absorption',
        term: 'Absorption',
        definition: 'The process of taking in water and nutrients',
      },
    ];

    const result = groupTermsByLetter(terms);

    expect(result).toEqual({
      A: [terms[0], terms[1]],
    });
  });
});
