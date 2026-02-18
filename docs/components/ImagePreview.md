# `ImagePreview`

## Purpose

`ImagePreview` displays a small thumbnail image that can be expanded into a full‑screen lightbox modal.
The component supports keyboard accessibility, Escape‑to‑close behavior, and optional descriptive text.

## Props

| Prop          | Type   | Required | Description                                                        |
| ------------- | ------ | -------- | ------------------------------------------------------------------ |
| `url`         | string | Yes      | The source URL of the image to display.                            |
| `alt`         | string | Yes      | Accessible alt text for both the thumbnail and the enlarged image. |
| `description` | string | No       | Optional caption or supporting text shown below the thumbnail.     |

## Example Usage

```jsx
<ImagePreview
  url="https://example.com/snakeplant.jpg"
  alt="A snake plant in a white pot on a wooden table."
  description="A snake plant in a white pot on a wooden table."
/>
```
