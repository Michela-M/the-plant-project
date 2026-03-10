import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { addCareEntry } from './addCareEntry';
import { db } from '@services/firebase';

// --- Mock Firestore ---
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  writeBatch: vi.fn(),
}));

vi.mock('@services/firebase', () => ({
  db: {},
}));

describe('addCareEntry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a care entry and commits the batch for non-water care', async () => {
    const mockBatch = {
      set: vi.fn(),
      update: vi.fn(),
      commit: vi.fn().mockResolvedValue(undefined),
    };
    const careEntriesCollectionRef = {};
    const careEntryRef = {};

    (writeBatch as Mock).mockReturnValue(mockBatch);
    (collection as Mock).mockReturnValue(careEntriesCollectionRef);
    (doc as Mock).mockReturnValue(careEntryRef);

    await addCareEntry({
      careType: 'fertilize',
      date: new Date('2026-03-01T10:00:00Z'),
      notes: 'Fed with diluted liquid fertilizer',
      otherCareType: 'foliar spray',
      plantId: 'plant-1',
      userId: 'user-1',
    });

    expect(writeBatch).toHaveBeenCalledWith(db);
    expect(collection).toHaveBeenCalledWith(
      db,
      'users/user-1/plants/plant-1/careEntries'
    );
    expect(doc).toHaveBeenCalledWith(careEntriesCollectionRef);
    expect(mockBatch.set).toHaveBeenCalledWith(careEntryRef, {
      careType: 'fertilize',
      date: new Date('2026-03-01T10:00:00Z'),
      notes: 'Fed with diluted liquid fertilizer',
      otherCareType: 'foliar spray',
    });
    expect(mockBatch.update).not.toHaveBeenCalled();
    expect(mockBatch.commit).toHaveBeenCalled();
  });

  it('updates plant watering fields when care type is water', async () => {
    const mockBatch = {
      set: vi.fn(),
      update: vi.fn(),
      commit: vi.fn().mockResolvedValue(undefined),
    };
    const careEntriesCollectionRef = {};
    const careEntryRef = {};
    const plantRef = {};
    const lastWateredDate = new Date('2026-03-05T08:00:00Z');
    const secondLastWateredDate = new Date('2026-02-26T08:00:00Z');
    const nextWateringDate = new Date('2026-03-12T08:00:00Z');

    (writeBatch as Mock).mockReturnValue(mockBatch);
    (collection as Mock).mockReturnValue(careEntriesCollectionRef);
    (doc as Mock)
      .mockReturnValueOnce(careEntryRef)
      .mockReturnValueOnce(plantRef);

    await addCareEntry({
      careType: 'water',
      date: lastWateredDate,
      plantId: 'plant-1',
      userId: 'user-1',
      inferredWateringFrequency: 7,
      lastWateredDate,
      secondLastWateredDate,
      nextWateringDate,
    });

    expect(mockBatch.update).toHaveBeenCalledWith(plantRef, {
      inferredWateringFrequency: 7,
      lastWateredDate,
      secondLastWateredDate,
      nextWateringDate,
    });
    expect(doc).toHaveBeenNthCalledWith(2, db, 'users/user-1/plants/plant-1');
    expect(mockBatch.commit).toHaveBeenCalled();
  });

  it('uses empty strings for optional notes and otherCareType', async () => {
    const mockBatch = {
      set: vi.fn(),
      update: vi.fn(),
      commit: vi.fn().mockResolvedValue(undefined),
    };
    const careEntriesCollectionRef = {};
    const careEntryRef = {};

    (writeBatch as Mock).mockReturnValue(mockBatch);
    (collection as Mock).mockReturnValue(careEntriesCollectionRef);
    (doc as Mock).mockReturnValue(careEntryRef);

    await addCareEntry({
      careType: 'prune',
      date: new Date('2026-03-07T10:00:00Z'),
      plantId: 'plant-1',
      userId: 'user-1',
    });

    expect(mockBatch.set).toHaveBeenCalledWith(careEntryRef, {
      careType: 'prune',
      date: new Date('2026-03-07T10:00:00Z'),
      notes: '',
      otherCareType: '',
    });
  });

  it('propagates errors from batch commit', async () => {
    const error = new Error('commit failed');
    const mockBatch = {
      set: vi.fn(),
      update: vi.fn(),
      commit: vi.fn().mockRejectedValue(error),
    };

    (writeBatch as Mock).mockReturnValue(mockBatch);
    (collection as Mock).mockReturnValue({});
    (doc as Mock).mockReturnValue({});

    await expect(
      addCareEntry({
        careType: 'water',
        date: new Date('2026-03-01T10:00:00Z'),
        plantId: 'plant-1',
        userId: 'user-1',
      })
    ).rejects.toThrow(error);
  });

  it('throws Unknown error for non-Error thrown values', async () => {
    (writeBatch as Mock).mockImplementation(() => {
      throw 'bad';
    });

    await expect(
      addCareEntry({
        careType: 'water',
        date: new Date('2026-03-01T10:00:00Z'),
        plantId: 'plant-1',
        userId: 'user-1',
      })
    ).rejects.toThrow('Unknown error');
  });
});
