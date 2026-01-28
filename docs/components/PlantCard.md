# `PlantCard`

## Purpose

The **PlantCard** component displays a plant’s core identifying information: image, family, and common name. It is a presentational component with no internal state

## Props

| Prop       | Type   | Required | Description                                                     |
| ---------- | ------ | -------- | --------------------------------------------------------------- |
| imageUrl   | string | no       | URL of the plant image. Falls back to a placeholder if missing. |
| family     | string | no       | Displays “Family Unknown” if not provided.                      |
| commonName | string | no       | Displays “Unknown” if missing.                                  |

## Example Usage

```jsx
<PlantCard
  imageUrl="https://example.com/monstera.jpg"
  family="Araceae"
  commonName="Monstera Deliciosa"
/>
```
