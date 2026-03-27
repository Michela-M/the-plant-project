# `Encyclopedia` Feature Overview

## Description

The encyclopedia feature provides browse and detail experiences for plant species.
It includes a list/grid browsing page and a dedicated species details page, both backed by Firestore services.

## Scope

This feature currently includes:

- Encyclopedia landing page and route
- View mode toggle between grid and list layouts
- Search bar to filter species by common name or family
- Firestore-driven species loading for browse view
- Species details route and page (`/species/:id`)
- Details page layout with header, main care content, and sidebar
- Characteristic badges and similar-species preview cards
- “Add to collection” UI affordances on browse cards/items

## Routes

| Route           | Component        | Purpose                              |
| --------------- | ---------------- | ------------------------------------ |
| `/`             | `Encyclopedia`   | Default app landing page             |
| `/encyclopedia` | `Encyclopedia`   | Explicit encyclopedia browsing route |
| `/species/:id`  | `SpeciesDetails` | Full details page for one species    |

## Main Flow

### Browse Species

1. User opens the encyclopedia page.
2. Default mode is grid view.
3. Page calls `getAllSpecies()` to load species from Firestore.
4. Species render as cards or list items based on selected view mode.

### Toggle View Mode

1. User uses the `ButtonRadio` toggle in the page header.
2. Selecting grid icon displays `SpeciesCard` items.
3. Selecting list icon displays `SpeciesListItem` items.

### Search Species

1. User types in the search bar below the header.
2. Search filters species in real-time by `commonName` or `family` (case-insensitive substring match).
3. Results update instantly in the current view mode (grid or list).
4. Clearing the search shows all species again.

### Open Species Details

1. User clicks a species card or list item.
2. App navigates to `/species/:id`.
3. Details page calls `getSpeciesDetails(id)`.
4. Page renders:
   - `SpeciesDetailsHeader`
   - `SpeciesDetailsMainContent`
   - `SpeciesDetailsSidebar`

### Add Affordance (Browse Views)

1. Hovering a species item reveals a plus icon button.
2. The button label is accessibility-friendly (e.g., “Add Snake Plant to collection”).
3. The action is currently visual-only and not yet wired to collection creation.

## Display Behavior

- Browse page shows `Spinner` while species are loading.
- Browse page shows `No species found. Please check back later.` when the database is empty and no search is active.
- Browse page shows `No species found. Try adjusting your search.` when a search query returns no matches.
- Species cards/list rows link to `/species/:id`.
- Browse item fallbacks:
  - Missing image falls back to placeholder URL.
  - Missing family shows `Unknown Family`.
  - Missing common name shows `Unknown`.
- Details page behavior:
  - Shows `Spinner` while loading details.
  - Shows `Species not found.` and a back link when no record is returned.
  - Sidebar similar-species section renders up to 3 items.

## Data Source (Current State)

- Data is loaded from Firestore (`species` collection).
- Browse page uses `getAllSpecies()` with `orderBy('commonName', 'asc')`.
- Details page and similar-species cards use `getSpeciesDetails(speciesId)`.
- Missing field values are normalized to safe defaults in service mapping.

## Dependencies

- `firebase/firestore` for species queries
- `lucide-react` for grid/list, add, and characteristic icons
- `ButtonRadio` for layout mode switching
- `Tag` component for species tags in list mode
- `IconButton` for add affordance actions
- `react-router-dom` for browse/details navigation
- Toast context for async error feedback

## Error Handling

- Browse fetch errors call `showError('Error loading species', details)`.
- Species-details fetch errors call `showError('Error loading species details', details)`.
- Similar-species fetch errors call `showError(message)`.
- Fallback values still protect UI rendering when data fields are missing.

## Current Limitations

- Filtering, pagination, and advanced sorting are not implemented.
- “Add to collection” actions in encyclopedia browse components are UI-only.
- Species details page buttons (`Add to Collection`, `Quick Add`) are currently placeholder actions.
- Similar-species cards trigger individual detail fetches (no batching/caching layer).

## Related Files

- `src/features/encyclopedia/pages/Encyclopedia.tsx`
- `src/features/encyclopedia/pages/SpeciesDetails.tsx`
- `src/features/encyclopedia/components/SpeciesCard.tsx`
- `src/features/encyclopedia/components/SpeciesListItem.tsx`
- `src/features/encyclopedia/components/SpeciesDetailsHeader.tsx`
- `src/features/encyclopedia/components/SpeciesDetailsMainContent.tsx`
- `src/features/encyclopedia/components/SpeciesDetailsSidebar.tsx`
- `src/features/encyclopedia/components/CharacteristicBadge.tsx`
- `src/features/encyclopedia/components/SimilarSpecies.tsx`
- `src/features/encyclopedia/services/getAllSpecies.tsx`
- `src/features/encyclopedia/services/getSpeciesDetails.tsx`
- `src/App.tsx`
