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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a plant and matching watering care entry when lastWateredDate is provided', async () => {
    const plantRef = { id: 'plant-1' };
    const careEntryRef = { id: 'care-1' };
    const set = vi.fn();
    const commit = vi.fn().mockResolvedValue(undefined);
    const batch = { commit, set };

    (writeBatch as Mock).mockReturnValue(batch);
    (collection as Mock)
      .mockReturnValueOnce({ path: 'users/user-1/plants' })
      .mockReturnValueOnce({ path: 'users/user-1/plants/plant-1/careEntries' });
    (doc as Mock)
      .mockReturnValueOnce(plantRef)
      .mockReturnValueOnce(careEntryRef);

    const lastWateredDate = new Date('2024-01-10');

    await addPlant({
      lastWateredDate,
      name: 'Monstera',
      nextWateringDate: new Date('2024-01-17'),
      notes: 'South window',
      speciesId: 'species-1',
      speciesName: 'Monstera deliciosa',
      trackWatering: true,
      userId: 'user-1',
      wateringFrequency: 7,
    });

    expect(writeBatch).toHaveBeenCalledWith(db);
    expect(collection).toHaveBeenNthCalledWith(1, db, 'users/user-1/plants');
    expect(doc).toHaveBeenNthCalledWith(1, { path: 'users/user-1/plants' });

    expect(set).toHaveBeenNthCalledWith(
      1,
      plantRef,
      expect.objectContaining({
        inferredWateringFrequency: 7,
        lastWateredDate,
        name: 'Monstera',
        nextWateringDate: new Date('2024-01-17'),
        notes: 'South window',
        speciesId: 'species-1',
        speciesName: 'Monstera deliciosa',
        trackWatering: true,
        wateringFrequency: 7,
      })
    );

    expect(set).toHaveBeenNthCalledWith(2, careEntryRef, {
      date: lastWateredDate,
      careType: 'water',
    });
    expect(collection).toHaveBeenNthCalledWith(
      2,
      db,
      'users/user-1/plants/plant-1/careEntries'
    );
    expect(doc).toHaveBeenNthCalledWith(2, {
      path: 'users/user-1/plants/plant-1/careEntries',
    });
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it('creates only the plant document when lastWateredDate is null', async () => {
    const plantRef = { id: 'plant-2' };
    const set = vi.fn();
    const commit = vi.fn().mockResolvedValue(undefined);
    const batch = { commit, set };

    (writeBatch as Mock).mockReturnValue(batch);
    (collection as Mock).mockReturnValue({ path: 'users/user-2/plants' });
    (doc as Mock).mockReturnValue(plantRef);

    await addPlant({
      lastWateredDate: null,
      name: 'Pothos',
      nextWateringDate: null,
      notes: '',
      speciesId: null,
      speciesName: 'Epipremnum aureum',
      trackWatering: false,
      userId: 'user-2',
      wateringFrequency: 0,
    });

    expect(collection).toHaveBeenCalledTimes(1);
    expect(doc).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith(
      plantRef,
      expect.objectContaining({
        inferredWateringFrequency: 0,
        lastWateredDate: null,
        nextWateringDate: null,
        trackWatering: false,
      })
    );
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it('rethrows Firestore errors from commit', async () => {
    const error = new Error('Commit failed');
    const batch = { commit: vi.fn().mockRejectedValue(error), set: vi.fn() };

    (writeBatch as Mock).mockReturnValue(batch);
    (collection as Mock).mockReturnValue({ path: 'users/user-1/plants' });
    (doc as Mock).mockReturnValue({ id: 'plant-1' });

    await expect(
      addPlant({
        lastWateredDate: null,
        name: 'Snake Plant',
        nextWateringDate: null,
        notes: '',
        speciesId: 'species-2',
        speciesName: 'Dracaena trifasciata',
        trackWatering: true,
        userId: 'user-1',
        wateringFrequency: 14,
      })
    ).rejects.toThrow(error);
  });

  it('throws a standard error for non-Error failures', async () => {
    const batch = {
      commit: vi.fn().mockRejectedValue('bad failure'),
      set: vi.fn(),
    };

    (writeBatch as Mock).mockReturnValue(batch);
    (collection as Mock).mockReturnValue({ path: 'users/user-1/plants' });
    (doc as Mock).mockReturnValue({ id: 'plant-1' });

    await expect(
      addPlant({
        lastWateredDate: null,
        name: 'Ficus',
        nextWateringDate: null,
        notes: '',
        speciesId: null,
        speciesName: 'Ficus elastica',
        trackWatering: true,
        userId: 'user-1',
        wateringFrequency: 10,
      })
    ).rejects.toThrow('Unknown error');
  });
});
