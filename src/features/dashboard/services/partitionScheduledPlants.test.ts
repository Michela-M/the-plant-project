import { describe, expect, it } from 'vitest';
import type { ScheduledPlant } from './getScheduledPlants';
import { partitionScheduledPlants } from './partitionScheduledPlants';

const basePlant: Omit<ScheduledPlant, 'id' | 'name' | 'nextWateringDate'> = {
  imageUrl: null,
  speciesName: 'Monstera deliciosa',
  wateringFrequency: 7,
};

describe('partitionScheduledPlants', () => {
  it('puts overdue and today plants in todayOrOverdue bucket', () => {
    const now = new Date('2026-03-02T10:00:00');
    const plants: ScheduledPlant[] = [
      {
        ...basePlant,
        id: '1',
        name: 'Overdue',
        nextWateringDate: new Date('2026-03-01T12:00:00'),
      },
      {
        ...basePlant,
        id: '2',
        name: 'Today',
        nextWateringDate: new Date('2026-03-02T21:00:00'),
      },
      {
        ...basePlant,
        id: '3',
        name: 'Tomorrow',
        nextWateringDate: new Date('2026-03-03T09:00:00'),
      },
      {
        ...basePlant,
        id: '4',
        name: 'No Date',
        nextWateringDate: null,
      },
    ];

    const { todayOrOverdue, afterToday } = partitionScheduledPlants(
      plants,
      now
    );

    expect(todayOrOverdue.map((plant) => plant.id)).toEqual(['1', '2']);
    expect(afterToday.map((plant) => plant.id)).toEqual(['3']);
  });
});
