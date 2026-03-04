import { describe, it, expect } from 'vitest';
import getLocalDateInputValue from './getLocalDateInputValue';

describe('getLocalDateInputValue', () => {
  it('formats date as YYYY-MM-DD with zero-padded month and day', () => {
    const result = getLocalDateInputValue(new Date('2026-01-05T10:00:00.000Z'));

    expect(result).toBe('2026-01-05');
  });

  it('keeps double-digit month and day values', () => {
    const result = getLocalDateInputValue(new Date('2026-11-23T18:30:00.000Z'));

    expect(result).toBe('2026-11-23');
  });
});
