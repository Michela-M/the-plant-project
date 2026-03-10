# `ImagePreview`

## Purpose

`ImagePreview` displays a small thumbnail image that can be expanded into a full-screen lightbox modal.
The component supports keyboard accessibility, Escape-to-close behavior, optional descriptive text, and click-to-close on both the backdrop and enlarged image.

## Props

| Prop          | Type   | Required | Description                                                        |
| ------------- | ------ | -------- | ------------------------------------------------------------------ |
| `url`         | string | Yes      | The source URL of the image to display.                            |
| `alt`         | string | Yes      | Accessible alt text for both the thumbnail and the enlarged image. |
| `description` | string | No       | Optional caption or supporting text shown below the thumbnail.     |

## Interaction Details

- Click the thumbnail to open the modal.
- Click the dark backdrop or the enlarged image to close the modal.
- Press Escape to close the modal.
- The enlarged image is constrained to the viewport using `max-w` and `max-h` so tall/wide images remain fully visible.

## Example Usage

```jsx
<ImagePreview
  url="https://example.com/snakeplant.jpg"
  alt="A snake plant in a white pot on a wooden table."
  description="A snake plant in a white pot on a wooden table."
/>
```
