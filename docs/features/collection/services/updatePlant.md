# `updatePlant` Service

## Description

`updatePlant` updates an existing plant document in Firestore with the provided fields.
It performs a partial update using `updateDoc`, meaning only the specified fields are changed while the rest of the document remains untouched.

This service is typically used when editing a plant’s details such as its name, species, watering frequency, notes, last watered date, or image URL.
The document path is user-scoped: `users/{userId}/plants/{plantId}`.

## Parameters

| Name        | Type     | Description                                               |
| ----------- | -------- | --------------------------------------------------------- |
| `plantId`   | `string` | Firestore document ID of the plant to update              |
| `plantData` | `object` | Fields to update (`name` required, others optional)       |
| `userId`    | `string` | User ID used to resolve `users/{userId}/plants/{plantId}` |

### `plantData` fields

| Field               | Type                | Description                                            |
| ------------------- | ------------------- | ------------------------------------------------------ |
| `name`              | `string`            | The plant’s name. Required.                            |
| `species`           | `string` (optional) | The plant’s species. Defaults to an empty string.      |
| `wateringFrequency` | `number` (optional) | Days between watering. Defaults to `0`.                |
| `lastWatered`       | `Date` \| `null`    | The last time the plant was watered.                   |
| `notes`             | `string` (optional) | Additional notes. Defaults to an empty string.         |
| `imageUrl`          | `string` (optional) | URL of the plant’s image. Defaults to an empty string. |

## Return Value

- `Promise<void>` on success
- Throws if Firestore fails

## Usage

Basic usage inside a form submit:

```tsx
await updatePlant(
  plantId,
  {
    name: values.name,
    species: values.species,
    wateringFrequency: Number(values.wateringFrequency),
    notes: values.notes,
    imageUrl: uploadedImageUrl,
  },
  userId
);
```

With error handling:

```tsx
try {
  await updatePlant(plantId, updatedData, userId);
  navigate('/collection');
} catch (err) {
  console.error('Failed to save plant:', err);
}
```

## Edge Cases

- **Missing plantId**  
  If plantId is undefined or empty, Firestore will attempt to update an invalid path.
  Always ensure plantId is defined before calling.

- **Missing userId**  
  An invalid/missing user ID creates an invalid document path and causes failure.

- **Overwriting fields with defaults**  
  Because the service uses fallbacks (`''`, `0`, `null`), passing `undefined` may unintentionally overwrite existing values.

- **Missing required fields**  
  Only name is required by your UI logic.
  Firestore will accept an empty string, but your app may break if the field is missing.

- **Invalid dates**  
  Firestore accepts JavaScript Date objects, but invalid dates will cause an error.

- **Image URL handling**  
  If `imageUrl` is omitted, it defaults to an empty string, overwriting the existing image.
  The caller must explicitly pass the previous image URL if no new image was uploaded.

- **Permission errors**  
  If Firestore security rules prevent updates, the function will throw.
