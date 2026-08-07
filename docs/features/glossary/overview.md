# `Glossary` Feature Overview

## Description

The glossary feature provides a searchable reference of plant-related terms and definitions. Terms are loaded from Firestore, grouped alphabetically, and displayed with optional supporting images.

## Scope

This feature currently includes:

- Glossary route and page (`/glossary`)
- Firestore-backed glossary term loading
- Case-insensitive term search
- Alphabetical navigation above and below the glossary entries
- Letter-based grouping of filtered terms
- Term definitions and supporting image captions
- Loading and empty-result states

## Routes

| Route       | Component  | Purpose                                         |
| ----------- | ---------- | ----------------------------------------------- |
| `/glossary` | `Glossary` | Browse and search plant-related glossary terms. |

## Main Flow

### Load Glossary Terms

1. User opens `/glossary`.
2. `Glossary` starts with an empty term list and sets its loading state to `true`.
3. The page calls `getTerms()` to fetch terms from Firestore.
4. Terms are stored in local state and the loading state is cleared when the request resolves.
5. The page groups the loaded terms with `groupTermsByLetter` and renders the glossary.

### Search Terms

1. User types in the `Search terms...` field.
2. Leading and trailing whitespace is removed from the query.
3. The query is normalized to lowercase.
4. Terms are filtered in real time using a case-insensitive substring match against each term's `term` field.
5. Filtered terms are regrouped by letter and the alphabet navigation updates to match the results.
6. Clearing the search displays all loaded terms again.

### Navigate by Letter

1. `AlphabetNav` receives the currently filtered terms grouped by letter.
2. Letters with matching terms link to their corresponding section anchor.
3. Letters without terms are shown as disabled and cannot be used for navigation.
4. Each populated letter renders a `LetterSection` containing its terms.
5. A second `AlphabetNav` appears below the results for navigation after browsing a section.

## Display Behavior

- `Spinner` displays `Loading definitions...` while terms are loading.
- `No glossary terms available.` displays when loading finishes with no terms.
- `No results found for "{searchQuery}".` displays when a non-empty search has no matches.
- The page displays no glossary sections while loading or when there are no matching terms.
- Each letter section displays its letter heading, term name, definition, and any associated images.
- Image captions are displayed below their images.
- Alphabet navigation includes all letters from A to Z, while only populated letters are interactive.

## Data Source (Current State)

- Terms are loaded from the Firestore `glossary` collection.
- `getTerms` orders documents by `term` in ascending order.
- Each returned term includes:
  - `id: string`
  - `term: string`
  - `definition: string`
  - `images: { url: string; caption: string; shape: '1:1' | '2:3' | '1:2' }[]`
- Missing `term` and `definition` values are normalized to empty strings by the service.
- Missing `images` values are normalized to an empty array by the service.
- `groupTermsByLetter` uses the uppercase first character of each document `id` as the grouping key.

## Dependencies

- `firebase/firestore` for glossary term retrieval
- `getTerms` for Firestore querying and response mapping
- `groupTermsByLetter` for letter-based grouping
- `AlphabetNav` for section navigation
- `LetterSection` for term and image rendering
- Shared `Spinner`, `TextField`, and `Typography` components
- `react-router-dom` for route registration

## Error Handling

- Loading state is shown while the Firestore request is pending.
- Empty data and no-search-results states are rendered after loading completes.
- Firestore errors currently propagate from `getTerms` without a page-level error state or toast.

## Current Limitations

- The page does not currently display a dedicated error state when loading terms fails.
- Letter grouping is based on the first character of the document `id`, which may differ from the first character of the displayed term.
- Search matches only the displayed `term` field, not definitions or image captions.
- Terms are loaded once when the page mounts and are not refreshed automatically.

## Related Files

- `src/features/glossary/pages/Glossary.tsx`
- `src/features/glossary/components/AlphabetNav.tsx`
- `src/features/glossary/components/LetterSection.tsx`
- `src/features/glossary/services/getTerms.tsx`
- `src/features/glossary/services/groupTermsByLetter.tsx`
- `src/App.tsx`
