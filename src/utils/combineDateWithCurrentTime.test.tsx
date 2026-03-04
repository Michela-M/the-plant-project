import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import combineDateWithCurrentTime from './combineDateWithCurrentTime';

describe('combineDateWithCurrentTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-04T14:15:16.789'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns current date/time when date input is empty', () => {
    const result = combineDateWithCurrentTime('');

    expect(result).toEqual(new Date('2026-03-04T14:15:16.789'));
  });

  it('returns current date/time when date input is invalid', () => {
    const result = combineDateWithCurrentTime('2026-invalid-04');

    expect(result).toEqual(new Date('2026-03-04T14:15:16.789'));
  });

  it('combines the provided date with the current time', () => {
    const result = combineDateWithCurrentTime('2025-11-09');

    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(10);
    expect(result.getDate()).toBe(9);
    expect(result.getHours()).toBe(14);
    expect(result.getMinutes()).toBe(15);
    expect(result.getSeconds()).toBe(16);
    expect(result.getMilliseconds()).toBe(789);
  });
});
