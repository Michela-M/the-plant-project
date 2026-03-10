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

  it('uses the new date as first lastWateredDate when no prior watering dates exist', async () => {
    const careDate = new Date('2026-03-01T12:00:00.000Z');

    (getPlantDetails as Mock).mockResolvedValue({
      inferredWateringFrequency: null,
      lastWateredDate: null,
      nextWateringDate: null,
      secondLastWateredDate: null,
      wateringFrequency: 0,
    });

    const result = await updateWateringDates('plant-1', 'user-1', careDate);

    expect(getPlantDetails).toHaveBeenCalledWith('plant-1', 'user-1');
    expect(result).toEqual({
      inferredWateringFrequency: 0,
      lastWateredDate: careDate,
      nextWateringDate: null,
      secondLastWateredDate: null,
    });
  });

  it('updates last/second-last and infers frequency when wateringFrequency is 0', async () => {
    const oldLast = new Date('2026-02-20T12:00:00.000Z');
    const oldSecondLast = new Date('2026-02-10T12:00:00.000Z');
    const careDate = new Date('2026-03-01T12:00:00.000Z');

    (getPlantDetails as Mock).mockResolvedValue({
      inferredWateringFrequency: 0,
      lastWateredDate: oldLast,
      nextWateringDate: null,
      secondLastWateredDate: oldSecondLast,
      wateringFrequency: 0,
    });

    const result = await updateWateringDates('plant-2', 'user-1', careDate);

    expect(result).toEqual({
      inferredWateringFrequency: 9,
      lastWateredDate: careDate,
      nextWateringDate: new Date('2026-03-10T12:00:00.000Z'),
      secondLastWateredDate: oldLast,
    });
  });

  it('updates secondLastWateredDate when new date is between last and second last', async () => {
    const lastWateredDate = new Date('2026-03-10T12:00:00.000Z');
    const secondLastWateredDate = new Date('2026-03-01T12:00:00.000Z');
    const careDate = new Date('2026-03-06T12:00:00.000Z');

    (getPlantDetails as Mock).mockResolvedValue({
      inferredWateringFrequency: 0,
      lastWateredDate,
      nextWateringDate: null,
      secondLastWateredDate,
      wateringFrequency: 0,
    });

    const result = await updateWateringDates('plant-3', 'user-1', careDate);

    expect(result).toEqual({
      inferredWateringFrequency: 4,
      lastWateredDate,
      nextWateringDate: new Date('2026-03-14T12:00:00.000Z'),
      secondLastWateredDate: careDate,
    });
  });

  it('calculates nextWateringDate using explicit wateringFrequency when provided', async () => {
    const lastWateredDate = new Date('2026-03-01T12:00:00.000Z');
    const careDate = new Date('2026-03-01T12:00:00.000Z');

    (getPlantDetails as Mock).mockResolvedValue({
      inferredWateringFrequency: 0,
      lastWateredDate,
      nextWateringDate: null,
      secondLastWateredDate: null,
      wateringFrequency: 7,
    });

    const result = await updateWateringDates('plant-4', 'user-1', careDate);

    expect(result).toEqual({
      inferredWateringFrequency: 7,
      lastWateredDate,
      nextWateringDate: new Date('2026-03-08T12:00:00.000Z'),
      secondLastWateredDate: careDate,
    });
  });

  it('calculates nextWateringDate using inferred watering frequency when explicit frequency is 0', async () => {
    const lastWateredDate = new Date('2026-03-01T12:00:00.000Z');
    const secondLastWateredDate = new Date('2026-02-20T12:00:00.000Z');
    const careDate = new Date('2026-03-11T12:00:00.000Z');

    (getPlantDetails as Mock).mockResolvedValue({
      inferredWateringFrequency: 0,
      lastWateredDate,
      nextWateringDate: null,
      secondLastWateredDate,
      wateringFrequency: 0,
    });

    const result = await updateWateringDates('plant-3', 'user-1', careDate);

    expect(result).toEqual({
      inferredWateringFrequency: 10,
      lastWateredDate: careDate,
      nextWateringDate: new Date('2026-03-21T12:00:00.000Z'),
      secondLastWateredDate: lastWateredDate,
    });
  });

  it('does not update watering dates when care entry date is before both last and second last watered dates', async () => {
    const lastWateredDate = new Date('2026-03-10T12:00:00.000Z');
    const secondLastWateredDate = new Date('2026-03-05T12:00:00.000Z');
    const careDate = new Date('2026-03-01T12:00:00.000Z');

    (getPlantDetails as Mock).mockResolvedValue({
      inferredWateringFrequency: 0,
      lastWateredDate,
      nextWateringDate: null,
      secondLastWateredDate,
      wateringFrequency: 0,
    });

    const result = await updateWateringDates('plant-5', 'user-1', careDate);

    expect(result).toEqual({
      inferredWateringFrequency: 5,
      lastWateredDate,
      nextWateringDate: new Date('2026-03-15T12:00:00.000Z'),
      secondLastWateredDate,
    });
  });

  it('uses explicit wateringFrequency for nextWateringDate when non-zero', async () => {
    const lastWateredDate = new Date('2026-03-05T12:00:00.000Z');
    const careDate = new Date('2026-03-01T12:00:00.000Z');

    (getPlantDetails as Mock).mockResolvedValue({
      inferredWateringFrequency: 1,
      lastWateredDate,
      nextWateringDate: null,
      secondLastWateredDate: null,
      wateringFrequency: 7,
    });

    const result = await updateWateringDates('plant-4', 'user-1', careDate);

    expect(result).toEqual({
      inferredWateringFrequency: 4,
      lastWateredDate,
      nextWateringDate: new Date('2026-03-12T12:00:00.000Z'),
      secondLastWateredDate: careDate,
    });
  });
});
