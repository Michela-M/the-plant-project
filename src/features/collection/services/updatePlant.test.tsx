import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { doc, updateDoc } from 'firebase/firestore';
import { updatePlant } from './updatePlant';
import { db } from '@services/firebase';

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: vi.fn(),
}));

vi.mock('@services/firebase', () => ({
  db: {},
}));

describe('updatePlant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates a plant document with provided fields', async () => {
    const mockPlantRef = { id: 'plant-ref' };
    const plantData = {
      name: 'Monstera',
      speciesName: 'Monstera deliciosa',
      speciesId: 'species-123',
      notes: 'Rotate weekly',
      wateringFrequency: 7,
      lastWateredDate: new Date('2026-03-10T12:00:00.000Z'),
      secondLastWateredDate: new Date('2026-03-03T12:00:00.000Z'),
      nextWateringDate: new Date('2026-03-17T12:00:00.000Z'),
    };

    (doc as Mock).mockReturnValue(mockPlantRef);
    (updateDoc as Mock).mockResolvedValue(undefined);

    await updatePlant('plant-1', plantData, 'user-1');

    expect(doc).toHaveBeenCalledWith(db, 'users/user-1/plants', 'plant-1');
    expect(updateDoc).toHaveBeenCalledWith(mockPlantRef, plantData);
  });

  it('passes through nullable watering metadata values', async () => {
    const mockPlantRef = { id: 'plant-ref' };
    const plantData = {
      inferredWateringFrequency: null,
      nextWateringDate: null,
    };

    (doc as Mock).mockReturnValue(mockPlantRef);
    (updateDoc as Mock).mockResolvedValue(undefined);

    await updatePlant('plant-2', plantData, 'user-1');

    expect(updateDoc).toHaveBeenCalledWith(mockPlantRef, plantData);
  });

  it('supports updating only a subset of fields', async () => {
    const mockPlantRef = { id: 'plant-ref' };
    const plantData = {
      imageUrl: 'https://example.com/plant.jpg',
    };

    (doc as Mock).mockReturnValue(mockPlantRef);
    (updateDoc as Mock).mockResolvedValue(undefined);

    await updatePlant('plant-3', plantData, 'user-99');

    expect(doc).toHaveBeenCalledWith(db, 'users/user-99/plants', 'plant-3');
    expect(updateDoc).toHaveBeenCalledWith(mockPlantRef, plantData);
  });

  it('supports updating trackWatering', async () => {
    const mockPlantRef = { id: 'plant-ref' };
    const plantData = {
      trackWatering: false,
    };

    (doc as Mock).mockReturnValue(mockPlantRef);
    (updateDoc as Mock).mockResolvedValue(undefined);

    await updatePlant('plant-6', plantData, 'user-1');

    expect(updateDoc).toHaveBeenCalledWith(mockPlantRef, plantData);
  });

  it('rethrows Firestore errors as-is when error is an Error instance', async () => {
    const error = new Error('Update failed');

    (doc as Mock).mockReturnValue({});
    (updateDoc as Mock).mockRejectedValue(error);

    await expect(
      updatePlant(
        'plant-4',
        {
          name: 'Pothos',
        },
        'user-1'
      )
    ).rejects.toThrow('Update failed');
  });

  it('throws a standard Unknown error for non-Error failures', async () => {
    (doc as Mock).mockReturnValue({});
    (updateDoc as Mock).mockRejectedValue('bad failure');

    await expect(
      updatePlant(
        'plant-5',
        {
          notes: 'Test note',
        },
        'user-1'
      )
    ).rejects.toThrow('Unknown error');
  });
});
