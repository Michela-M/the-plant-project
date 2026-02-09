# `PlantCard`

## Purpose

The **PlantCard** component displays a user's plant core identifying information: image, common name, and nickname. It is a presentational component with no internal state.

## Props

| Prop         | Type      | Required | Description                                                     |
| ------------ | --------- | -------- | --------------------------------------------------------------- |
| `imageUrl`   | `string`  | no       | URL of the plant image. Falls back to a placeholder if missing. |
| `commonName` |  `string` | no       | Does not display if missing.                                    |
| `nickname`   | `string`  | yes      | Provided by the user on plant creation.                         |

# Example Usage

```jsx
<PlantCard
    imageUrl="https://example.com/monstera.jpg"
    nickname="John"
    commonName="Monstera Deliciosa"
>
```
