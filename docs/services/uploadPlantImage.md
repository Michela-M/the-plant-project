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

## Edge Casess

This service does not perform validation. The caller must ensure:

- The file is not null or undefined
- The file type is appropriate (PNG/JPEG)
- The file size is acceptable
- The user has permission to upload to this Storage path
- The plantId is valid and not empty

Other considerations:

- Uploading a file with the same name will overwrite the previous one in the same folder
- Network issues or Firebase Storage rules may cause upload failures
- Large files may take longer to upload or fail depending on connection quality
