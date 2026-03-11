# `ImagePicker`

## Purpose

`ImagePicker` is a small UI component that displays a plant image (either a preview or a fallback placeholder) and allows the user to select a new image file from their device.
It does not upload the file itself — instead, it passes the selected `File` object back to the parent via the `onSelect` callback.
This keeps the component simple, reusable, and focused on UI interaction only.

## Accessibility Notes

- In the current implementation, image alt text is generated internally and is not configurable through props.
- Current alt behavior:
  - Preview image present: `Selected image preview`.
  - Preview image missing: `No image selected, showing placeholder`.
- If custom alt text is needed, the component API must be extended with an alt-related prop.

## Props

| Prop         | Type                   | Description                                                                       |
| ------------ | ---------------------- | --------------------------------------------------------------------------------- |
| `previewUrl` | `string \| null`       | The URL of the image to display. If `null`, a placeholder image is shown.         |
| `onSelect`   | `(file: File) => void` | Callback fired when the user selects a file. Receives the selected `File` object. |

## Example Usage

```jsx
import ImagePicker from './ImagePicker';
import { useState } from 'react';

export default function EditPlantImage() {
  const [file, setFile] = (useState < File) | (null > null);
  const [preview, setPreview] = (useState < string) | (null > null);

  return (
    <ImagePicker
      previewUrl={preview}
      onSelect={(selectedFile) => {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      }}
    />
  );
}
```
