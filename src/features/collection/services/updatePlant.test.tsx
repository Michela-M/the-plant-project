import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updatePlant } from './updatePlant';
import { db } from '@services/firebase';

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
}));

vi.mock('@services/firebase', () => ({
  db: {},
}));

describe('updatePlant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses explicit wateringFrequency and calculates next watering date when non-zero', async () => {
    const plantId = 'plant-1';
    const userId = 'user-1';
    const lastWateredDate = new Date('2024-01-01');

    (getDoc as Mock).mockResolvedValue({
      data: () => ({
        inferredWateringFrequency: 0,
        lastWateredDate,
        secondLastWateredDate: new Date('2023-12-25'),
        wateringFrequency: 0,
      }),
      exists: () => true,
    });

    await updatePlant(
      plantId,
      {
        name: 'Monstera',
        notes: 'Updated notes',
        species: 'Monstera deliciosa',
        wateringFrequency: 7,
      },
      userId
    );

    const plantRef = (doc as Mock).mock.results[0].value;
    expect(doc).toHaveBeenCalledWith(db, `users/${userId}/plants`, plantId);
    expect(getDoc).toHaveBeenCalledWith(plantRef);
    expect(updateDoc).toHaveBeenCalledWith(
      plantRef,
      expect.objectContaining({
        wateringFrequency: 7,
        inferredWateringFrequency: 7,
        lastWateredDate,
        nextWateringDate: new Date('2024-01-08'),
      })
    );
  });

  it('uses inferred frequency when wateringFrequency is zero and both watering dates exist', async () => {
    const plantId = 'plant-1';
    const userId = 'user-1';
    const lastWateredDate = new Date('2024-01-10');
    const secondLastWateredDate = new Date('2024-01-01');

    (getDoc as Mock).mockResolvedValue({
      data: () => ({
        inferredWateringFrequency: 0,
        lastWateredDate,
        secondLastWateredDate,
        wateringFrequency: 0,
      }),
      exists: () => true,
    });

    await updatePlant(
      plantId,
      {
        name: 'Pothos',
        wateringFrequency: 0,
      },
      userId
    );

    const plantRef = (doc as Mock).mock.results[0].value;
    expect(updateDoc).toHaveBeenCalledWith(
      plantRef,
      expect.objectContaining({
        wateringFrequency: 0,
        inferredWateringFrequency: 9,
        lastWateredDate,
        secondLastWateredDate,
        nextWateringDate: new Date('2024-01-19'),
      })
    );
  });

  it('keeps nextWateringDate null when wateringFrequency is zero and dates are missing', async () => {
    const plantId = 'plant-1';
    const userId = 'user-1';

    (getDoc as Mock).mockResolvedValue({
      data: () => ({
        inferredWateringFrequency: 3,
        lastWateredDate: null,
        secondLastWateredDate: null,
        wateringFrequency: 0,
      }),
      exists: () => true,
    });

    await updatePlant(
      plantId,
      {
        name: 'ZZ Plant',
      },
      userId
    );

    const plantRef = (doc as Mock).mock.results[0].value;
    expect(updateDoc).toHaveBeenCalledWith(
      plantRef,
      expect.objectContaining({
        wateringFrequency: 0,
        nextWateringDate: null,
      })
    );
  });

  it('uses stored lastWateredDate/secondLastWateredDate values when inferring schedule', async () => {
    const plantId = 'plant-1';
    const userId = 'user-1';
    const storedLast = new Date('2024-01-01');
    const storedSecondLast = new Date('2023-12-25');

    (getDoc as Mock).mockResolvedValue({
      data: () => ({
        inferredWateringFrequency: 1,
        lastWateredDate: storedLast,
        secondLastWateredDate: storedSecondLast,
        wateringFrequency: 0,
      }),
      exists: () => true,
    });

    await updatePlant(
      plantId,
      {
        name: 'Snake Plant',
        wateringFrequency: 0,
      },
      userId
    );

    const plantRef = (doc as Mock).mock.results[0].value;
    expect(updateDoc).toHaveBeenCalledWith(
      plantRef,
      expect.objectContaining({
        inferredWateringFrequency: 7,
        lastWateredDate: storedLast,
        secondLastWateredDate: storedSecondLast,
        nextWateringDate: new Date('2024-01-08'),
      })
    );
  });

  it('propagates updateDoc errors', async () => {
    const error = new Error('Update failed');

    (getDoc as Mock).mockResolvedValue({
      data: () => ({
        inferredWateringFrequency: 0,
        lastWateredDate: new Date('2024-01-01'),
        secondLastWateredDate: null,
        wateringFrequency: 3,
      }),
      exists: () => true,
    });
    (updateDoc as Mock).mockRejectedValue(error);

    await expect(
      updatePlant(
        'plant-1',
        {
          name: 'Calathea',
          wateringFrequency: 3,
        },
        'user-1'
      )
    ).rejects.toThrow(error);
  });
});
