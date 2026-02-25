# `SpeciesDetailsMainContent` Component

## Purpose

The **SpeciesDetailsMainContent** component renders the long-form informational content for a species. It displays the overview description and all care sections in a fixed order.

## Props

| Prop             | Type                 | Required | Description                                                      |
| ---------------- | -------------------- | -------- | ---------------------------------------------------------------- |
| `speciesDetails` | `SpeciesDetailsData` | yes      | Full species object used to render description and care content. |

### `speciesDetails` fields used

- `description`
- `watering`
- `light`
- `humidity`
- `temperature`
- `soilAndRepotting`
- `fertilizing`
- `pestsAndProblems`
- `propagation`

## Behavior Notes

- Renders sections in this order:
  1.  Watering
  2.  Light Requirements
  3.  Humidity
  4.  Temperature
  5.  Soil & Repotting
  6.  Fertilizing
  7.  Pests & Problems
  8.  Propagation
- Each section shows `content.text`.
- Section images are optional and only render when `content.images.length > 0`.
- When images exist, each image is rendered through `ImagePreview` with:
  - `url` from `img.url`
  - `alt` and `description` from `img.description`

## Example Usage

```jsx
<SpeciesDetailsMainContent speciesDetails={speciesDetails} />
```
