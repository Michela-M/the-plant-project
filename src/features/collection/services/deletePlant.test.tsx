import { deleteDoc, doc } from 'firebase/firestore';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { db } from '@services/firebase';
import deletePlant from './deletePlant';

vi.mock('firebase/firestore', () => ({
  deleteDoc: vi.fn(),
  doc: vi.fn(),
}));

vi.mock('@services/firebase', () => ({
  db: {},
}));

describe('deletePlant', () => {
  it('should delete a plant document from Firestore', async () => {
    const mockPlantId = '123',
     mockDocRef = {};
    (doc as Mock).mockReturnValue(mockDocRef);
    (deleteDoc as Mock).mockResolvedValue(undefined);

    await deletePlant(mockPlantId, 'test-user');

    expect(doc).toHaveBeenCalledWith(db, 'users/test-user/plants', mockPlantId);
    expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
  });

  it('should throw an error if deletion fails', async () => {
    const mockPlantId = '123',
     mockError = new Error('Deletion failed');
    (doc as Mock).mockReturnValue({});
    (deleteDoc as Mock).mockRejectedValue(mockError);

    await expect(deletePlant(mockPlantId, 'test-user')).rejects.toThrow(
      'Deletion failed'
    );
  });
});
