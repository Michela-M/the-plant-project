# `PlantCard`

## Purpose

The **PlantCard** component displays a user's plant core identifying information: image, common name, and name. It is a presentational component with no internal state.

## Props

| Prop    | Type   | Required | Description                                        |
| ------- | ------ | -------- | -------------------------------------------------- |
| `plant` | object | yes      | Plant data used to render the card and navigation. |

### `plant` shape

| Field        | Type     | Required | Description                                                     |
| ------------ | -------- | -------- | --------------------------------------------------------------- |
| `id`         | `string` | yes      | Used for navigation to `/plants/:id`.                           |
| `name`       | `string` | yes      | Display name (falls back to `"Unnamed Plant"` if empty).        |
| `commonName` | `string` | no       | Optional common name.                                           |
| `imageUrl`   | `string` | no       | URL of the plant image. Falls back to a placeholder if missing. |

## Example Usage

```jsx
<PlantCard
  plant={{
    id: 'plant-1',
    name: 'John',
    commonName: 'Monstera Deliciosa',
    imageUrl: 'https://example.com/monstera.jpg',
  }}
/>
```
