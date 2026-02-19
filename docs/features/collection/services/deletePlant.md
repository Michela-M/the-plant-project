# `deletePlant` Service

## Description

`deletePlant` deletes a single plant document from the signed-in user’s Firestore path:
`users/{userId}/plants/{plantId}`.
It returns the promise from Firestore so callers can await completion or handle errors.

## Parameters

| Name      | Type     | Required | Description                                     |
| --------- | -------- | -------- | ----------------------------------------------- |
| `plantId` | `string` | Yes      | Firestore document ID of the plant to delete    |
| `userId`  | `string` | Yes      | User ID used to resolve `users/{userId}/plants` |

## Return Value

| Type            | Description                                                         |
| --------------- | ------------------------------------------------------------------- |
| `Promise<void>` | Resolves when the document is deleted. Rejects on Firestore errors. |

## Usage

```tsx
import deletePlant from '../services/deletePlant';

await deletePlant('abc123', 'user-123');
```

## Edge Cases

### Document does not exist

`deleteDoc` does not throw if the document is already missing; callers can still treat completion as success.

### Firestore errors

Errors are propagated to the caller so the UI can show a toast or retry.
