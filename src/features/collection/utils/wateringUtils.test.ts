import { describe } from 'vitest';
import {
  calculateWateringFrequency,
  calculateNextWateringDate,
} from './wateringUtils';
import { it, expect } from 'vitest';

describe('wateringUtils - calculateWateringFrequency', () => {
  it('should calculate the watering frequency when both dates are provided', () => {
    const lastWateredDate = new Date('2024-06-01');
    const secondLastWateredDate = new Date('2024-05-25');
    const result = calculateWateringFrequency({
      firstDate: secondLastWateredDate,
      secondDate: lastWateredDate,
    });
    expect(result).toBe(7);
  });

  it('should return 0 when both dates are the same', () => {
    const date = new Date('2024-06-01');
    const result = calculateWateringFrequency({
      firstDate: date,
      secondDate: date,
    });
    expect(result).toBe(0);
  });

  it('should return a positive number when the second date is after the first date', () => {
    const firstDate = new Date('2024-05-25');
    const secondDate = new Date('2024-06-01');
    const result = calculateWateringFrequency({
      firstDate,
      secondDate,
    });
    expect(result).toBe(7);
  });

  it('should return a positive number when the first date is after the second date', () => {
    const firstDate = new Date('2024-06-01');
    const secondDate = new Date('2024-05-25');
    const result = calculateWateringFrequency({
      firstDate,
      secondDate,
    });
    expect(result).toBe(7);
  });
});

describe('wateringUtils - calculateNextWateringDate', () => {
  it('should calculate the next watering date based on last watered date and frequency', () => {
    const lastWateredDate = new Date('2024-06-01');
    const wateringFrequency = 7;
    const result = calculateNextWateringDate({
      lastWateredDate,
      wateringFrequency,
    });
    expect(result.toISOString()).toBe(new Date('2024-06-08').toISOString());
  });

  it('should return the same date if the watering frequency is 0', () => {
    const lastWateredDate = new Date('2024-06-01');
    const wateringFrequency = 0;
    const result = calculateNextWateringDate({
      lastWateredDate,
      wateringFrequency,
    });
    expect(result.toISOString()).toBe(lastWateredDate.toISOString());
  });

  it('should handle negative watering frequency by returning a past date', () => {
    const lastWateredDate = new Date('2024-06-01');
    const wateringFrequency = -7;
    const result = calculateNextWateringDate({
      lastWateredDate,
      wateringFrequency,
    });
    expect(result.toISOString()).toBe(new Date('2024-05-25').toISOString());
  });
});
