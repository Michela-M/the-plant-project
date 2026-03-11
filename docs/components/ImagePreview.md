# `ImagePreview`

## Purpose

`ImagePreview` displays a small thumbnail image that can be expanded into a full-screen lightbox modal.
The component supports keyboard accessibility, Escape-to-close behavior, optional descriptive text, and click-to-close on both the backdrop and enlarged image.

## Props

| Prop          | Type   | Required | Description                                                    |
| ------------- | ------ | -------- | -------------------------------------------------------------- |
| `url`         | string | Yes      | The source URL of the image to display.                        |
| `alt`         | string | Yes      | Short, specific alt text for the thumbnail and enlarged image. |
| `description` | string | No       | Optional caption/supporting text shown below the thumbnail.    |

## Interaction Details

- Click the thumbnail to open the modal.
- Click the dark backdrop or the enlarged image to close the modal.
- Press Escape to close the modal.
- The enlarged image is constrained to the viewport using `max-w` and `max-h` so tall/wide images remain fully visible.
- Alt-text guidance:
  - Keep `alt` concise and focused on what is visually present.
  - Use `description` for longer explanatory or instructional text.
  - Avoid repeating the exact same sentence in both `alt` and `description`.

## Example Usage

```jsx
<ImagePreview
  url="https://example.com/snakeplant.jpg"
  alt="Snake plant in a white ceramic pot"
  description="Healthy upright leaves with dark green variegation"
/>
```
