import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import formatRelativeDate from './formatRelativeDate';

describe('formatRelativeDate (start-of-day version)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Freeze time: Jan 10, 2025 at 15:30
    vi.setSystemTime(new Date('2025-01-10T15:30:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "today" for any time on the same day', () => {
    expect(formatRelativeDate({ date: new Date('2025-01-10T00:01:00') })).toBe(
      'today'
    );
    expect(formatRelativeDate({ date: new Date('2025-01-10T23:59:00') })).toBe(
      'today'
    );
  });

  it('returns "yesterday" for the previous calendar day', () => {
    expect(formatRelativeDate({ date: new Date('2025-01-09T00:01:00') })).toBe(
      'yesterday'
    );
    expect(formatRelativeDate({ date: new Date('2025-01-09T23:59:00') })).toBe(
      'yesterday'
    );
  });

  it('returns "tomorrow" for the next calendar day', () => {
    expect(formatRelativeDate({ date: new Date('2025-01-11T00:01:00') })).toBe(
      'tomorrow'
    );
    expect(formatRelativeDate({ date: new Date('2025-01-11T23:59:00') })).toBe(
      'tomorrow'
    );
  });

  it('handles past dates more than one day ago', () => {
    expect(formatRelativeDate({ date: new Date('2025-01-07T12:00:00') })).toBe(
      '3 days ago'
    );
  });

  it('handles future dates more than one day ahead', () => {
    expect(formatRelativeDate({ date: new Date('2025-01-15T09:00:00') })).toBe(
      'in 5 days'
    );
  });

  it('does not produce off-by-one errors near midnight (past)', () => {
    vi.setSystemTime(new Date('2025-01-10T23:59:00'));
    expect(formatRelativeDate({ date: new Date('2025-01-09T00:01:00') })).toBe(
      'yesterday'
    );
  });

  it('does not produce off-by-one errors near midnight (future)', () => {
    vi.setSystemTime(new Date('2025-01-10T00:01:00'));
    expect(formatRelativeDate({ date: new Date('2025-01-11T23:59:00') })).toBe(
      'tomorrow'
    );
  });

  it('handles far past dates', () => {
    expect(formatRelativeDate({ date: new Date('2024-12-01T12:00:00') })).toBe(
      '40 days ago'
    );
  });

  it('handles far future dates', () => {
    expect(formatRelativeDate({ date: new Date('2025-03-01T12:00:00') })).toBe(
      'in 50 days'
    );
  });

  it('handles DST transitions (spring forward)', () => {
    vi.setSystemTime(new Date('2025-03-09T12:00:00')); // DST start
    expect(formatRelativeDate({ date: new Date('2025-03-08T12:00:00') })).toBe(
      'yesterday'
    );
  });

  it('handles DST transitions (fall back)', () => {
    vi.setSystemTime(new Date('2025-11-02T12:00:00')); // DST end
    expect(formatRelativeDate({ date: new Date('2025-11-01T12:00:00') })).toBe(
      'yesterday'
    );
  });
});
