import { collection, doc, writeBatch } from 'firebase/firestore';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { addPlant } from './addPlant';
import { db } from '@services/firebase';

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  writeBatch: vi.fn(),
}));

vi.mock('@services/firebase', () => ({
  db: {},
}));

describe('addPlant', () => {
  let batchMock: { set: Mock; commit: Mock };

  beforeEach(() => {
    vi.clearAllMocks();

    batchMock = {
      set: vi.fn(),
      commit: vi.fn().mockResolvedValue(undefined),
    };

    (writeBatch as Mock).mockReturnValue(batchMock);

    (collection as Mock).mockImplementation((_dbArg, path: string) => ({
      path,
    }));

    (doc as Mock).mockImplementation((collectionRef: { path: string }) => ({
      id: 'new-plant-id',
      path: `${collectionRef.path}/new-plant-id`,
    }));
  });

  it('creates a plant with required fields and default values', () => {
    const plantData = {
      name: 'Aloe Vera',
      userId: 'test-user',
    };

    return expect(addPlant(plantData)).resolves.toEqual(
      expect.objectContaining({
        name: plantData.name,
        species: '',
        notes: '',
        wateringFrequency: 0,
        lastWateredDate: null,
        inferredWateringFrequency: 0,
        secondLastWateredDate: null,
        nextWateringDate: null,
        trackWatering: false,
        userId: plantData.userId,
      })
    );
  });

  it('handles watering frequency without last watered date', () => {
    const plantData = {
      name: 'Snake Plant',
      userId: 'test-user',
      wateringFrequency: 7,
    };

    return expect(addPlant(plantData)).resolves.toEqual(
      expect.objectContaining({
        name: plantData.name,
        species: '',
        notes: '',
        wateringFrequency: 7,
        lastWateredDate: null,
        inferredWateringFrequency: 7,
        secondLastWateredDate: null,
        nextWateringDate: null,
        trackWatering: false,
        userId: plantData.userId,
      })
    );
  });

  it('calculates next watering date when watering frequency and last watered date are provided', () => {
    const plantData = {
      name: 'Spider Plant',
      userId: 'test-user',
      wateringFrequency: 3,
      lastWateredDate: new Date('2024-01-01'),
    };

    const expectedNextWateringDate = new Date('2024-01-04');

    return expect(addPlant(plantData)).resolves.toEqual(
      expect.objectContaining({
        name: plantData.name,
        wateringFrequency: 3,
        lastWateredDate: plantData.lastWateredDate,
        inferredWateringFrequency: 3,
        nextWateringDate: expectedNextWateringDate,
        trackWatering: true,
      })
    );
  });

  it('writes plant and care entry atomically in one batch commit when lastWateredDate exists', async () => {
    const plantData = {
      name: 'Parlor Palm',
      userId: 'test-user',
      lastWateredDate: new Date('2024-02-01'),
    };

    await addPlant(plantData);

    expect(writeBatch).toHaveBeenCalledWith(db);
    expect(collection).toHaveBeenNthCalledWith(
      1,
      db,
      `users/${plantData.userId}/plants`
    );
    expect(collection).toHaveBeenNthCalledWith(
      2,
      db,
      `users/${plantData.userId}/plants/new-plant-id/careEntries`
    );

    expect(batchMock.set).toHaveBeenCalledTimes(2);

    const [, careEntryDoc] = batchMock.set.mock.calls[1];
    expect(careEntryDoc).toEqual(
      expect.objectContaining({
        careType: 'water',
        date: plantData.lastWateredDate,
        notes: '',
      })
    );

    expect(batchMock.commit).toHaveBeenCalledTimes(1);
  });

  it('writes only plant in batch when lastWateredDate is not provided', async () => {
    const plantData = {
      name: 'Jade Plant',
      userId: 'test-user',
    };

    await addPlant(plantData);

    expect(batchMock.set).toHaveBeenCalledTimes(1);
    expect(collection).toHaveBeenCalledTimes(1);
    expect(batchMock.commit).toHaveBeenCalledTimes(1);
  });

  it('calls batch.set with fully constructed plant object', async () => {
    const plantData = {
      name: 'Pothos',
      userId: 'test-user',
      wateringFrequency: 5,
      lastWateredDate: new Date('2024-01-01'),
    };

    await addPlant(plantData);

    const [, plantDoc] = batchMock.set.mock.calls[0];
    expect(plantDoc).toEqual(
      expect.objectContaining({
        name: plantData.name,
        species: '',
        notes: '',
        wateringFrequency: 5,
        lastWateredDate: plantData.lastWateredDate,
        inferredWateringFrequency: 5,
        secondLastWateredDate: null,
        nextWateringDate: new Date('2024-01-06'),
        trackWatering: true,
        userId: plantData.userId,
      })
    );
  });

  it('propagates batch commit errors', async () => {
    const plantData = {
      name: 'Calathea',
      userId: 'test-user',
    };

    const error = new Error('Batch commit failed');
    batchMock.commit.mockRejectedValue(error);

    await expect(addPlant(plantData)).rejects.toThrow(error);
  });

  it('handles falsy non-zero-like wateringFrequency values correctly', async () => {
    const plantData = {
      name: 'Dracaena',
      userId: 'test-user',
      wateringFrequency: undefined,
      lastWateredDate: new Date('2024-01-01'),
    };

    await expect(addPlant(plantData)).resolves.toEqual(
      expect.objectContaining({
        name: plantData.name,
        species: '',
        notes: '',
        wateringFrequency: 0,
        lastWateredDate: plantData.lastWateredDate,
        inferredWateringFrequency: 0,
        secondLastWateredDate: null,
        nextWateringDate: null,
        trackWatering: false,
        userId: plantData.userId,
      })
    );
  });

  it('rejects when lastWateredDate is invalid', async () => {
    const plantData = {
      name: 'Rubber Plant',
      userId: 'test-user',
      wateringFrequency: 7,
      lastWateredDate: 'invalid-date' as unknown as Date,
    };

    await expect(addPlant(plantData)).rejects.toThrow();
  });
});
