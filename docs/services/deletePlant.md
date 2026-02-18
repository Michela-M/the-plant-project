# `deletePlant` Service

## Description

`deletePlant` deletes a single plant document from the Firestore `test-plants` collection.
It returns the promise from Firestore so callers can await completion or handle errors.

## Parameters

| Name      | Type     | Required | Description                                       |
| --------- | -------- | -------- | ------------------------------------------------- |
| `plantId` | `string` | Yes      | The Firestore document ID of the plant to delete. |

## Return Value

| Type            | Description                                                         |
| --------------- | ------------------------------------------------------------------- |
| `Promise<void>` | Resolves when the document is deleted. Rejects on Firestore errors. |

## Usage

```tsx
import deletePlant from '../services/deletePlant';

await deletePlant('abc123');
```

## Edge Cases

### Document does not exist

Firestore will resolve or reject based on rules; callers should handle errors.

### Firestore errors

Errors are propagated to the caller so the UI can show a toast or retry.
