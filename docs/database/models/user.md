# User

## Overview

Represents an authenticated app user.
Each user document stores account-level profile metadata and acts as the parent for user-owned plant data.

## Fields

| Field     | Type   | Optional | Description                                           |
| --------- | ------ | -------- | ----------------------------------------------------- |
| id        | string | no       | Firebase Auth UID (used as the Firestore document ID) |
| email     | string | no       | User email address saved at sign-up                   |
| createdAt | Date   | no       | Timestamp set when the user account is registered     |

## Relationships

- **User → Plant** (one-to-many)
  One user can own many plant documents.

- **User → History** (one-to-many, via plants)
  Care history events belong to plants, which belong to a user.

## Firestore Storage

- User document:
  `users/{userId}`

- User plants subcollection:
  `users/{userId}/plants/{plantId}`

- Plant history subcollection:
  `users/{userId}/plants/{plantId}/history/{eventId}`

## Constraints and Rules

- `id` must match the Firebase Auth UID.
- `email` must be a non-empty, valid email string.
- `createdAt` must be set on user creation.
- User documents are created during registration (`registerUser`) and should exist before writing user-scoped plant data.

## Example Document

```json
{
  "id": "u_7f2c1a9b",
  "email": "example@main.com",
  "createdAt": "2026-02-19T10:15:00Z"
}
```
