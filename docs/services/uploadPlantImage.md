# `uploadPlantImage` Service

## Description

`uploadPlantImage` uploads a single image file to Firebase Storage under a plant‑specific folder and returns the publicly accessible download URL.
It is used when creating or editing a plant to store its associated image.

This service only handles uploading — it does not update Firestore.
The returned URL should be saved separately using your savePlant service.

## Parameters

| Name      |  Type    | Description                                                                |
| --------- | -------- | -------------------------------------------------------------------------- |
| `file`    | `File`   | The image file selected by the user (PNG or JPEG).                         |
| `plantId` | `string` | The ID of the plant, used to namespace the image path in Firebase Storage. |

## Return Value

Type: `Promise<string>`

Resolves to the public download URL of the uploaded image.
This URL can be safely stored in Firestore and displayed in the UI.

## Usage

```jsx
import { uploadPlantImage } from '../services/uploadPlantImage';

async function handleImageUpload(file: File, plantId: string) {
  const imageUrl = await uploadPlantImage(file, plantId);

  // Save the URL to Firestore or use it in your UI
  console.log("Uploaded image URL:", imageUrl);
}
```

Typical usage inside a form submit:

```jsx
const imageUrl = file
  ? await uploadPlantImage(file, plantId)
  : existingImageUrl;

await savePlant(plantId, { ...values, imageUrl });
```

## Validation

This service performs the following validations and throws an error if any fail:

- **File type**: Must be an image (checked via MIME type starting with `image/`)
- **File size**: Must not exceed 5MB

The service throws an `Error` with a descriptive message if validation fails.

## Edge Cases

- Uploading a file with the same name will overwrite the previous one in the same folder
- Network issues or Firebase Storage rules may cause upload failures
- Large files may take longer to upload or fail depending on connection quality
