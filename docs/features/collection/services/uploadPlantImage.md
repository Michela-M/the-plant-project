# `uploadPlantImage` Service

## Description

`uploadPlantImage` uploads a single image file to Firebase Storage under a plant‑specific folder and returns the publicly accessible download URL.
It is used when creating or editing a plant to store its associated image.

This service only handles uploading — it does not update Firestore.
The returned URL should be saved separately using the `updatePlant` service.

Current storage path format:

- `users/{userId}/plants/{plantId}/{uuid}.{extension}`

## Parameters

| Name      | Type     | Description                               |
| --------- | -------- | ----------------------------------------- |
| `file`    | `File`   | The image file selected by the user       |
| `plantId` | `string` | Plant ID used to namespace the image path |
| `userId`  | `string` | User ID used to namespace storage by user |

## Return Value

Type: `Promise<string>`

Resolves to the public download URL of the uploaded image.
This URL can be safely stored in Firestore and displayed in the UI.

## Usage

```tsx
import { uploadPlantImage } from '../services/uploadPlantImage';

async function handleImageUpload(file: File, plantId: string, userId: string) {
  const imageUrl = await uploadPlantImage(file, plantId, userId);

  // Save the URL to Firestore or use it in your UI
  console.log('Uploaded image URL:', imageUrl);
}
```

Typical usage inside a form submit:

```tsx
const imageUrl = file
  ? await uploadPlantImage(file, plantId, userId)
  : existingImageUrl;

await updatePlant(plantId, { ...values, imageUrl });
```

## Validation

Validation is delegated to `imageValidation(file)`.

- If validation fails, the service throws `Error(validationMessage)`.
- If validation passes, the file is uploaded and a download URL is returned.

## Edge Cases

- Each upload uses a UUID filename, so repeated uploads will not overwrite previous files
- Network issues or Firebase Storage rules may cause upload failures
- Large files may take longer to upload or fail depending on connection quality
