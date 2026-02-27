import { describe, expect, it } from 'vitest';
import { firebaseTimestampToDate } from './firebaseDate';

describe('firebaseTimestampToDate', () => {
  it('returns the same Date when input is a valid Date', () => {
    const date = new Date('2024-01-01T00:00:00.000Z');

    const result = firebaseTimestampToDate(date);

    expect(result).toBe(date);
  });

  it('converts Timestamp-like objects using toDate()', () => {
    const expectedDate = new Date('2024-02-01T00:00:00.000Z');
    const timestampLike = {
      toDate: () => expectedDate,
    };

    const result = firebaseTimestampToDate(timestampLike);

    expect(result).toEqual(expectedDate);
  });

  it('returns null when input is invalid', () => {
    expect(firebaseTimestampToDate('not-a-date')).toBeNull();
    expect(firebaseTimestampToDate(undefined)).toBeNull();
    expect(firebaseTimestampToDate({})).toBeNull();
    expect(firebaseTimestampToDate(new Date('invalid'))).toBeNull();
  });

  it('returns null when toDate() returns an invalid Date', () => {
    const timestampLike = {
      toDate: () => new Date('invalid'),
    };

    const result = firebaseTimestampToDate(timestampLike);

    expect(result).toBeNull();
  });
});
