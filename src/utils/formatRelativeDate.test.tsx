import { describe, it, expect } from 'vitest';
import formatRelativeDate from './formatRelativeDate';

describe('formatRelativeDate', () => {
  it('formats past dates correctly', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 3);
    expect(formatRelativeDate({ date: pastDate })).toBe('3 days ago');
  });

  it('formats future dates correctly', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    expect(formatRelativeDate({ date: futureDate })).toBe('in 5 days');
  });

  it('formats today correctly', () => {
    const today = new Date();
    expect(formatRelativeDate({ date: today })).toBe('today');
  });
});
