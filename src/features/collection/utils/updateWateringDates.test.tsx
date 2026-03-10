import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import updateWateringDates from './updateWateringDates';
import { getPlantDetails } from '../services/getPlantDetails';

vi.mock('../services/getPlantDetails', () => ({
  getPlantDetails: vi.fn(),
}));

describe('updateWateringDates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const buildPlantDetails = (overrides: Record<string, unknown> = {}) => ({
    inferredWateringFrequency: 0,
    lastWateredDate: null,
    nextWateringDate: null,
    secondLastWateredDate: null,
    wateringFrequency: 0,
    ...overrides,
  });

  it('fetches plant details using plant and user ids', async () => {
    (getPlantDetails as Mock).mockResolvedValue(buildPlantDetails());

    await updateWateringDates('plant-1', 'user-1', {
      date: new Date('2026-03-01T12:00:00.000Z'),
    });

    expect(getPlantDetails).toHaveBeenCalledWith('plant-1', 'user-1');
  });

  it('sets first watering date when no prior dates exist', async () => {
    const date = new Date('2026-03-01T12:00:00.000Z');
    (getPlantDetails as Mock).mockResolvedValue(buildPlantDetails());

    const result = await updateWateringDates('plant-1', 'user-1', { date });

    expect(result).toEqual({
      inferredWateringFrequency: 0,
      lastWateredDate: date,
      nextWateringDate: null,
      secondLastWateredDate: null,
    });
  });

  it('moves previous lastWateredDate to secondLast when newer date is provided', async () => {
    const oldLast = new Date('2026-02-20T12:00:00.000Z');
    const newDate = new Date('2026-03-01T12:00:00.000Z');

    (getPlantDetails as Mock).mockResolvedValue(
      buildPlantDetails({
        lastWateredDate: oldLast,
      })
    );

    const result = await updateWateringDates('plant-2', 'user-1', {
      date: newDate,
    });

    expect(result).toEqual({
      inferredWateringFrequency: 9,
      lastWateredDate: newDate,
      nextWateringDate: new Date('2026-03-10T12:00:00.000Z'),
      secondLastWateredDate: oldLast,
    });
  });

  it('updates only secondLastWateredDate when date is between last and second last', async () => {
    const lastWateredDate = new Date('2026-03-10T12:00:00.000Z');
    const secondLastWateredDate = new Date('2026-03-01T12:00:00.000Z');
    const date = new Date('2026-03-06T12:00:00.000Z');

    (getPlantDetails as Mock).mockResolvedValue(
      buildPlantDetails({
        lastWateredDate,
        secondLastWateredDate,
      })
    );

    const result = await updateWateringDates('plant-3', 'user-1', { date });

    expect(result).toEqual({
      inferredWateringFrequency: 4,
      lastWateredDate,
      nextWateringDate: new Date('2026-03-14T12:00:00.000Z'),
      secondLastWateredDate: date,
    });
  });

  it('does not reorder dates when provided date is older than both stored dates', async () => {
    const lastWateredDate = new Date('2026-03-10T12:00:00.000Z');
    const secondLastWateredDate = new Date('2026-03-05T12:00:00.000Z');

    (getPlantDetails as Mock).mockResolvedValue(
      buildPlantDetails({
        lastWateredDate,
        secondLastWateredDate,
      })
    );

    const result = await updateWateringDates('plant-4', 'user-1', {
      date: new Date('2026-03-01T12:00:00.000Z'),
    });

    expect(result).toEqual({
      inferredWateringFrequency: 5,
      lastWateredDate,
      nextWateringDate: new Date('2026-03-15T12:00:00.000Z'),
      secondLastWateredDate,
    });
  });

  it('uses explicit stored wateringFrequency for nextWateringDate', async () => {
    const lastWateredDate = new Date('2026-03-01T12:00:00.000Z');

    (getPlantDetails as Mock).mockResolvedValue(
      buildPlantDetails({
        lastWateredDate,
        wateringFrequency: 7,
      })
    );

    const result = await updateWateringDates('plant-5', 'user-1', {
      date: lastWateredDate,
    });

    expect(result).toEqual({
      inferredWateringFrequency: 7,
      lastWateredDate,
      nextWateringDate: new Date('2026-03-08T12:00:00.000Z'),
      secondLastWateredDate: lastWateredDate,
    });
  });

  it('supports wateringFreq-only updates and prioritizes provided wateringFreq', async () => {
    const lastWateredDate = new Date('2026-03-05T12:00:00.000Z');

    (getPlantDetails as Mock).mockResolvedValue(
      buildPlantDetails({
        inferredWateringFrequency: 1,
        lastWateredDate,
        wateringFrequency: 7,
      })
    );

    const result = await updateWateringDates('plant-6', 'user-1', {
      wateringFreq: 3,
    });

    expect(result).toEqual({
      inferredWateringFrequency: 1,
      lastWateredDate,
      nextWateringDate: new Date('2026-03-08T12:00:00.000Z'),
      secondLastWateredDate: null,
    });
  });

  it('keeps existing nextWateringDate when no lastWateredDate exists', async () => {
    const nextWateringDate = new Date('2026-03-20T12:00:00.000Z');

    (getPlantDetails as Mock).mockResolvedValue(
      buildPlantDetails({
        inferredWateringFrequency: 5,
        nextWateringDate,
      })
    );

    const result = await updateWateringDates('plant-7', 'user-1', {
      wateringFreq: 3,
    });

    expect(result).toEqual({
      inferredWateringFrequency: 5,
      lastWateredDate: null,
      nextWateringDate,
      secondLastWateredDate: null,
    });
  });
});
