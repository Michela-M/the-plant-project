import { addDoc, collection } from 'firebase/firestore';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { addPlant } from './addPlant';
import { db } from '@services/firebase';

// --- Mock Firestore ---
vi.mock('firebase/firestore', () => ({
  addDoc: vi.fn(),
  collection: vi.fn(),
}));

vi.mock('@services/firebase', () => ({
  db: {},
}));

describe('addPlant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Basic creation with only required fields
  it('creates a plant with required fields and default values', () => {
    const plantData = {
      name: 'Aloe Vera',
      userId: 'test-user',
    };

    (addDoc as Mock).mockResolvedValue({ id: 'new-plant-id' });

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

  // Watering frequency provided but no lastWateredDate
  it('handles watering frequency without last watered date', () => {
    const plantData = {
      name: 'Snake Plant',
      userId: 'test-user',
      wateringFrequency: 7,
    };

    (addDoc as Mock).mockResolvedValue({ id: 'new-plant-id' });

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

  // lastWateredDate provided but no wateringFrequency
  it('handles last watered date without watering frequency', () => {
    const plantData = {
      name: 'Peace Lily',
      userId: 'test-user',
      lastWateredDate: new Date(),
    };

    (addDoc as Mock).mockResolvedValue({ id: 'new-plant-id' });

    return expect(addPlant(plantData)).resolves.toEqual(
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

  // Both wateringFrequency and lastWateredDate provided
  it('calculates next watering date when watering frequency and last watered date are provided', () => {
    const plantData = {
      name: 'Spider Plant',
      userId: 'test-user',
      wateringFrequency: 3,
      lastWateredDate: new Date('2024-01-01'),
    };

    const expectedNextWateringDate = new Date('2024-01-04');

    (addDoc as Mock).mockResolvedValue({ id: 'new-plant-id' });

    return expect(addPlant(plantData)).resolves.toEqual(
      expect.objectContaining({
        name: plantData.name,
        species: '',
        notes: '',
        wateringFrequency: 3,
        lastWateredDate: plantData.lastWateredDate,
        inferredWateringFrequency: 3,
        secondLastWateredDate: null,
        nextWateringDate: expectedNextWateringDate,
        trackWatering: true,
        userId: plantData.userId,
      })
    );
  });

  // Provided optional fields override defaults
  it('uses provided optional fields instead of defaults', () => {
    const plantData = {
      name: 'Fiddle Leaf Fig',
      userId: 'test-user',
      species: 'Ficus lyrata',
      notes: 'Needs bright light',
    };

    (addDoc as Mock).mockResolvedValue({ id: 'new-plant-id' });

    return expect(addPlant(plantData)).resolves.toEqual(
      expect.objectContaining({
        name: plantData.name,
        species: plantData.species,
        notes: plantData.notes,
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

  // addDoc is called with the correct collection path
  it('calls addDoc with the correct collection path', async () => {
    const plantData = {
      name: 'Monstera',
      userId: 'test-user',
    };

    (addDoc as Mock).mockResolvedValue({ id: 'new-plant-id' });

    await addPlant(plantData);

    expect(collection).toHaveBeenNthCalledWith(
      1,
      db,
      `users/${plantData.userId}/plants`
    );
  });

  // addDoc receives the fully constructed plant object
  it('calls addDoc with the fully constructed plant object', async () => {
    const plantData = {
      name: 'Pothos',
      userId: 'test-user',
      wateringFrequency: 5,
      lastWateredDate: new Date('2024-01-01'),
    };

    const expectedPlantDoc = expect.objectContaining({
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
    });

    (addDoc as Mock).mockResolvedValue({ id: 'new-plant-id' });

    await addPlant(plantData);

    const [, plantDoc] = (addDoc as Mock).mock.calls[0];
    expect(plantDoc).toEqual(expectedPlantDoc);
  });

  // addDoc errors propagate correctly when they are already Error objects
  it('propagates addDoc errors that are already Error objects', async () => {
    const plantData = {
      name: 'Calathea',
      userId: 'test-user',
    };

    const error = new Error('Firestore error');
    (addDoc as Mock).mockRejectedValue(error);

    await expect(addPlant(plantData)).rejects.toThrow(error);
  });

  it('creates an initial water care entry when lastWateredDate is provided', async () => {
    const plantData = {
      name: 'Parlor Palm',
      userId: 'test-user',
      lastWateredDate: new Date('2024-02-01'),
    };

    (addDoc as Mock).mockResolvedValue({ id: 'new-plant-id' });

    await addPlant(plantData);

    expect(collection).toHaveBeenNthCalledWith(
      2,
      db,
      `users/${plantData.userId}/plants/new-plant-id/careEntries`
    );

    const [, careEntryDoc] = (addDoc as Mock).mock.calls[1];
    expect(careEntryDoc).toEqual(
      expect.objectContaining({
        careType: 'water',
        date: plantData.lastWateredDate,
        notes: '',
      })
    );
  });

  it('does not create a care entry when lastWateredDate is not provided', async () => {
    const plantData = {
      name: 'Jade Plant',
      userId: 'test-user',
    };

    (addDoc as Mock).mockResolvedValue({ id: 'new-plant-id' });

    await addPlant(plantData);

    expect(addDoc).toHaveBeenCalledTimes(1);
    expect(collection).toHaveBeenCalledTimes(1);
  });

  it('propagates errors from care entry creation', async () => {
    const plantData = {
      name: 'Boston Fern',
      userId: 'test-user',
      lastWateredDate: new Date('2024-01-01'),
    };

    (addDoc as Mock)
      .mockResolvedValueOnce({ id: 'new-plant-id' })
      .mockRejectedValueOnce(new Error('Care entry write failed'));

    await expect(addPlant(plantData)).rejects.toThrow(
      'Care entry write failed'
    );
  });

  // wateringFrequency is a falsy non-zero-like value (e.g., undefined)
  it('handles falsy non-zero-like wateringFrequency values correctly', async () => {
    const plantData = {
      name: 'Dracaena',
      userId: 'test-user',
      wateringFrequency: undefined,
      lastWateredDate: new Date('2024-01-01'),
    };

    (addDoc as Mock).mockResolvedValue({ id: 'new-plant-id' });

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

  // lastWateredDate is invalid (e.g., not a Date)
  it('rejects when lastWateredDate is invalid', async () => {
    const plantData = {
      name: 'Rubber Plant',
      userId: 'test-user',
      wateringFrequency: 7,
      lastWateredDate: 'invalid-date' as unknown as Date,
    };

    (addDoc as Mock).mockResolvedValue({ id: 'new-plant-id' });

    await expect(addPlant(plantData)).rejects.toThrow();
  });
});
