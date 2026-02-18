import { describe, it, expect, vi } from 'vitest';
import { updatePlant } from './updatePlant';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Mock } from 'vitest';

// --- Mock Firestore ---
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: vi.fn(),
}));

vi.mock('../firebase', () => ({
  db: {},
}));

describe('updatePlant', () => {
  it('should update plant data in Firestore', async () => {
    const plantId = '123';
    const plantData = {
      name: 'Fern',
      species: 'Pteridophyta',
      wateringFrequency: 7,
      lastWatered: new Date('2024-01-01'),
      notes: 'Needs indirect light',
      imageUrl: 'http://example.com/fern.jpg',
    };

    const mockDocRef = {};
    (doc as Mock).mockReturnValue(mockDocRef);
    (updateDoc as Mock).mockResolvedValue(undefined);

    await updatePlant(plantId, plantData);

    expect(doc).toHaveBeenCalledWith(db, 'test-plants', plantId);
    expect(updateDoc).toHaveBeenCalledWith(mockDocRef, {
      name: plantData.name,
      species: plantData.species,
      wateringFrequency: plantData.wateringFrequency,
      lastWatered: plantData.lastWatered,
      notes: plantData.notes,
      imageUrl: plantData.imageUrl,
    });
  });

  it('should throw an error if update fails', async () => {
    const plantId = '123';
    const plantData = {
      name: 'Fern',
      species: 'Pteridophyta',
      wateringFrequency: 7,
      lastWatered: new Date('2024-01-01'),
      notes: 'Needs indirect light',
      imageUrl: 'http://example.com/fern.jpg',
    };

    (doc as Mock).mockReturnValue({});
    (updateDoc as Mock).mockRejectedValue(new Error('Firestore error'));

    await expect(updatePlant(plantId, plantData)).rejects.toThrow(
      'Firestore error'
    );
  });

  it('should handle unknown errors gracefully', async () => {
    const plantId = '123';
    const plantData = {
      name: 'Fern',
      species: 'Pteridophyta',
      wateringFrequency: 7,
      lastWatered: new Date('2024-01-01'),
      notes: 'Needs indirect light',
      imageUrl: 'http://example.com/fern.jpg',
    };

    (doc as Mock).mockReturnValue({});
    (updateDoc as Mock).mockRejectedValue('Unknown error');

    await expect(updatePlant(plantId, plantData)).rejects.toThrow(
      'Unknown error'
    );
  });

  it('should normalize missing optional fields to safe defaults', async () => {
    const plantId = '123';
    const plantData = {
      name: 'Fern',
    };

    const mockDocRef = {};
    (doc as Mock).mockReturnValue(mockDocRef);
    (updateDoc as Mock).mockResolvedValue(undefined);

    await updatePlant(plantId, plantData);

    expect(updateDoc).toHaveBeenCalledWith(mockDocRef, {
      name: plantData.name,
      species: '',
      wateringFrequency: 0,
      lastWatered: null,
      notes: '',
      imageUrl: '',
    });
  });
});
