import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { beforeEach, type Mock, describe, expect, it, vi } from 'vitest';
import { db } from '@services/firebase';
import deletePlant from './deletePlant';

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(),
  writeBatch: vi.fn(),
}));

vi.mock('@services/firebase', () => ({
  db: {},
}));

describe('deletePlant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes careEntries first and then deletes the plant document', async () => {
    const batchDelete = vi.fn();
    const commit = vi.fn().mockResolvedValue(undefined);
    const careEntryRef1 = { id: 'care-1-ref' };
    const careEntryRef2 = { id: 'care-2-ref' };
    const careEntriesCollectionRef = { id: 'care-entries-ref' };
    const plantDocRef = { id: 'plant-ref' };

    (collection as Mock).mockReturnValue(careEntriesCollectionRef);
    (getDocs as Mock).mockResolvedValue({
      empty: false,
      docs: [{ ref: careEntryRef1 }, { ref: careEntryRef2 }],
    });
    (writeBatch as Mock).mockReturnValue({
      delete: batchDelete,
      commit,
    });
    (doc as Mock).mockReturnValue(plantDocRef);
    (deleteDoc as Mock).mockResolvedValue(undefined);

    await deletePlant('123', 'test-user');

    expect(collection).toHaveBeenCalledWith(
      db,
      'users/test-user/plants/123/careEntries'
    );
    expect(getDocs).toHaveBeenCalledWith(careEntriesCollectionRef);
    expect(writeBatch).toHaveBeenCalledWith(db);
    expect(batchDelete).toHaveBeenCalledTimes(2);
    expect(batchDelete).toHaveBeenNthCalledWith(1, careEntryRef1);
    expect(batchDelete).toHaveBeenNthCalledWith(2, careEntryRef2);
    expect(commit).toHaveBeenCalledTimes(1);
    expect(doc).toHaveBeenCalledWith(db, 'users/test-user/plants', '123');
    expect(deleteDoc).toHaveBeenCalledWith(plantDocRef);
  });

  it('chunks careEntries deletion into multiple batches when over 500 docs', async () => {
    const docs = Array.from({ length: 501 }, (_, index) => ({
      ref: { id: `care-ref-${index}` },
    }));
    const batchDelete1 = vi.fn();
    const batchDelete2 = vi.fn();
    const commit1 = vi.fn().mockResolvedValue(undefined);
    const commit2 = vi.fn().mockResolvedValue(undefined);
    const plantDocRef = { id: 'plant-ref' };

    (collection as Mock).mockReturnValue({ id: 'care-entries-ref' });
    (getDocs as Mock).mockResolvedValue({
      empty: false,
      docs,
    });
    (writeBatch as Mock)
      .mockReturnValueOnce({ delete: batchDelete1, commit: commit1 })
      .mockReturnValueOnce({ delete: batchDelete2, commit: commit2 });
    (doc as Mock).mockReturnValue(plantDocRef);
    (deleteDoc as Mock).mockResolvedValue(undefined);

    await deletePlant('123', 'test-user');

    expect(writeBatch).toHaveBeenCalledTimes(2);
    expect(batchDelete1).toHaveBeenCalledTimes(500);
    expect(batchDelete2).toHaveBeenCalledTimes(1);
    expect(commit1).toHaveBeenCalledTimes(1);
    expect(commit2).toHaveBeenCalledTimes(1);
    expect(deleteDoc).toHaveBeenCalledWith(plantDocRef);
  });

  it('deletes only the plant document when careEntries is empty', async () => {
    const plantDocRef = { id: 'plant-ref' };
    const careEntriesCollectionRef = { id: 'care-entries-ref' };

    (collection as Mock).mockReturnValue(careEntriesCollectionRef);
    (getDocs as Mock).mockResolvedValue({
      empty: true,
      docs: [],
    });
    (doc as Mock).mockReturnValue(plantDocRef);
    (deleteDoc as Mock).mockResolvedValue(undefined);

    await deletePlant('123', 'test-user');

    expect(writeBatch).not.toHaveBeenCalled();
    expect(deleteDoc).toHaveBeenCalledWith(plantDocRef);
  });

  it('propagates errors when deleting the plant fails', async () => {
    const mockError = new Error('Deletion failed');

    (collection as Mock).mockReturnValue({ id: 'care-entries-ref' });
    (getDocs as Mock).mockResolvedValue({
      empty: true,
      docs: [],
    });
    (doc as Mock).mockReturnValue({});
    (deleteDoc as Mock).mockRejectedValue(mockError);

    await expect(deletePlant('123', 'test-user')).rejects.toThrow(
      'Deletion failed'
    );
  });
});
