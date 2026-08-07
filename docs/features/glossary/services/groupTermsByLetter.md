# `groupTermsByLetter`

## Purpose

Groups glossary terms into an object keyed by an uppercase letter. This result can be passed to `AlphabetNav` or used to render one `LetterSection` for each populated letter.

## Parameters

| Name    | Type                                                                                                                             | Required | Description                  |
| ------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------- |
| `terms` | `{ id: string; term: string; definition: string; images: { url: string; caption: string; shape: '1:1' \| '2:3' \| '1:2' }[] }[]` | yes      | The glossary terms to group. |

## Returns

A `Record<string, GlossaryTerm[]>` where each key is the uppercase first character of a term's `id`, and each value is an array of terms with that key.

## Behavior Notes

- Creates a new empty grouping object for each call.
- Converts the first character of each `id` to uppercase before using it as a key.
- Preserves the original order of terms within each group.
- Returns an empty object when the input array is empty.
- Terms with an empty `id` are grouped under the empty-string key.

## Example Usage

```ts
import { groupTermsByLetter } from '@features/glossary/services/groupTermsByLetter';

const groupedTerms = groupTermsByLetter(terms);

// Example result:
// {
//   A: [airPurifyingTerm],
//   B: [bonsaiTerm],
// }
```

## Expected Input Shape

```ts
type GlossaryTerm = {
  id: string;
  term: string;
  definition: string;
  images: {
    url: string;
    caption: string;
    shape: '1:1' | '2:3' | '1:2';
  }[];
};
```
