# `getUserPlants` Service

## Purpose

Fetches all plants belonging to a user for a specific species from Firestore. Used to display the user's plants related to a species in the encyclopedia sidebar or other UI components.

## Parameters

| Name        | Type   | Required | Description                                 |
| ----------- | ------ | -------- | ------------------------------------------- |
| `userId`    | string | yes      | The user's unique identifier.               |
| `speciesId` | string | yes      | The species ID to filter the user's plants. |

## Returns

A `Promise` resolving to an array of plant objects:

- `id`: string — The plant's document ID
- `imageUrl`: string \| null — The plant's image URL or null if missing
- `name`: string — The plant's name (defaults to 'Unnamed Plant' if missing)
- `speciesName`: string — The species name (may be empty)

## Example Usage

```ts
import { getUserPlants } from '.../getUserPlants';

const userPlants = await getUserPlants('user123', 'species456');
// userPlants is an array of plant objects for that user and species
```
