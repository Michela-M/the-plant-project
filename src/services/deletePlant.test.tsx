import { describe, it, expect, vi } from 'vitest';
import deletePlant from './deletePlant';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Mock } from 'vitest';

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  deleteDoc: vi.fn(),
}));

vi.mock('../firebase', () => ({
  db: {},
}));

describe('deletePlant', () => {
  it('should delete a plant document from Firestore', async () => {
    const mockPlantId = '123';
    const mockDocRef = {};
    (doc as Mock).mockReturnValue(mockDocRef);
    (deleteDoc as Mock).mockResolvedValue(undefined);

    await deletePlant(mockPlantId);

    expect(doc).toHaveBeenCalledWith(db, 'test-plants', mockPlantId);
    expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
  });
});
