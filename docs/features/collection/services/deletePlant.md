# `deletePlant` Service

## Description

`deletePlant` deletes a single plant document from the signed-in user’s Firestore path:
`users/{userId}/plants/{plantId}`.
Before deleting the plant document, it deletes all documents in the plant's `careEntries` subcollection:
`users/{userId}/plants/{plantId}/careEntries`.

Deletion order:

1. Read `careEntries` subcollection.
2. If entries exist, delete them in one or more Firestore batches (chunked to max 500 deletes per batch).
3. Delete the plant document.

## Parameters

| Name      | Type     | Required | Description                                     |
| --------- | -------- | -------- | ----------------------------------------------- |
| `plantId` | `string` | Yes      | Firestore document ID of the plant to delete    |
| `userId`  | `string` | Yes      | User ID used to resolve `users/{userId}/plants` |

## Return Value

| Type            | Description                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| `Promise<void>` | Resolves when care entries (if any) and the plant document are deleted. Rejects on Firestore errors. |

## Usage

```tsx
import deletePlant from '../services/deletePlant';

await deletePlant('abc123', 'user-123');
```

## Edge Cases

### Document does not exist

`deleteDoc` does not throw if the document is already missing; callers can still treat completion as success.

### No care entries

If the `careEntries` subcollection is empty, the service skips batch deletion and deletes only the plant document.

### More than 500 care entries

Firestore write batches are limited to 500 operations. The service chunks care entry deletes into batches of 500 or fewer and commits each batch before deleting the plant document.

### Firestore errors

Errors are propagated to the caller so the UI can show a toast or retry.
