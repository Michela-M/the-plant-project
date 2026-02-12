# `savePlant` Service

## Description

`savePlant` updates an existing plant document in Firestore with the provided fields.
It performs a partial update using `updateDoc`, meaning only the specified fields are changed while the rest of the document remains untouched.

This service is typically used when editing a plant’s details such as its name, species, watering frequency, notes, last watered date, or image URL.
It assumes that all validation and preprocessing (e.g., converting strings to numbers, ensuring required fields exist) has already been handled by the UI or form layer.

## Parameters

| Name        | Type     | Description                                                                                        |
| ----------- | -------- | -------------------------------------------------------------------------------------------------- |
| `plantId`   | `string` | The Firestore document ID of the plant to update.                                                  |
| `plantData` | `object` | An object containing the fields to update. Only `name` is required; all other fields are optional. |

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

The function returns a Promise that resolves to void.

If the update fails, the function throws an error.
Callers should wrap it in a try/catch block to handle failures gracefully.

## Usage

Basic usage inside a form submit:

```jsx
await savePlant(plantId, {
  name: values.name,
  species: values.species,
  wateringFrequency: Number(values.wateringFrequency),
  notes: values.notes,
  imageUrl: uploadedImageUrl,
});
```

With error handling:

```jsx
try {
  await savePlant(plantId, updatedData);
  navigate('/collection');
} catch (err) {
  console.error('Failed to save plant:', err);
}
```

## Edge Cases

- **Missing plantId**  
   If plantId is undefined or empty, Firestore will attempt to update an invalid path.
  Always ensure plantId is defined before calling.

- **Overwriting fields with defaults**  
  Because the service uses fallbacks ('', 0, null), passing undefined may unintentionally overwrite existing values.

- **Missing required fields**  
  Only name is required by your UI logic.
  Firestore will accept an empty string, but your app may break if the field is missing.

- **Invalid dates**  
  Firestore accepts JavaScript Date objects, but invalid dates will cause an error.

- **Image URL handling**  
  If imageUrl is omitted, it defaults to an empty string, overwriting the existing image.
  The caller must explicitly pass the previous image URL if no new image was uploaded.

- **Permission errors**  
  If Firestore security rules prevent updates, the function will throw.
