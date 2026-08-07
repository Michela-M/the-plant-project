# `getTerms` Service

## Purpose

Fetches all glossary terms from the `glossary` Firestore collection. Terms are ordered alphabetically by their `term` field before being returned for display in the glossary.

## Parameters

This service does not require any parameters.

## Returns

A `Promise` resolving to an array of glossary term objects:

- `id`: `string` - The Firestore document ID.
- `term`: `string` - The glossary term, or an empty string if the field is missing.
- `definition`: `string` - The term definition, or an empty string if the field is missing.
- `images`: `{ url: string; caption: string; shape: '1:1' | '2:3' | '1:2' }[]` - Supporting term images, or an empty array if the field is missing.

## Behavior Notes

- Reads documents from the Firestore `glossary` collection.
- Sorts results by `term` in ascending order through the Firestore query.
- Applies fallback values for missing `term`, `definition`, and `images` fields.
- Propagates errors from the Firestore query if the request fails.

## Example Usage

```ts
import { getTerms } from '@features/glossary/services/getTerms';

const terms = await getTerms();
// terms contains glossary entries ordered by term
```
