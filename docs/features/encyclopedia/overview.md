# `Encyclopedia` Feature Overview

## Description

The encyclopedia feature presents plant species in a browseable UI with two presentation modes: grid cards and list items.
It is currently a front-end display feature with static sample data and reusable species components.

## Scope

This feature currently includes:

- Encyclopedia landing page and route
- View mode toggle between grid and list layouts
- Species card presentation for compact browsing
- Species list item presentation for richer, descriptive browsing
- “Add to collection” action affordance on species items

## Routes

| Route           | Component      | Purpose                              |
| --------------- | -------------- | ------------------------------------ |
| `/`             | `Encyclopedia` | Default app landing page             |
| `/encyclopedia` | `Encyclopedia` | Explicit encyclopedia browsing route |

## Main Flow

### Browse Species

1. User opens the encyclopedia page.
2. Default mode is grid view.
3. Species are rendered as visual cards with image, family, and common name.

### Toggle View Mode

1. User uses the `ButtonRadio` toggle in the page header.
2. Selecting grid icon displays `SpeciesCard` items.
3. Selecting list icon displays `SpeciesListItem` items.

### Add Affordance

1. Hovering a species item reveals a plus icon button.
2. The button label is accessibility-friendly (e.g., “Add Snake Plant to collection”).
3. The action is currently visual-only and not yet wired to collection creation.

## Display Behavior

- Missing `imageUrl` falls back to a placeholder image.
- Missing `family` falls back to `Unknown Family`.
- Missing `commonName` falls back to `Unknown`.
- List items support tags and a truncated description (`line-clamp-2`).

## Data Source (Current State)

- Species content is hardcoded directly in the page component.
- No API, Firestore query, or external encyclopedia data service is currently used.
- Repeated sample entries are used as placeholder content for layout development.

## Dependencies

- `lucide-react` for grid/list and add icons
- `ButtonRadio` for layout mode switching
- `Tag` component for species tags in list mode
- `IconButton` for add affordance actions

## Error Handling

- No asynchronous data loading is performed, so there are currently no loading or fetch error states.
- Fallback values handle incomplete species props in UI rendering.

## Current Limitations

- Encyclopedia is static and not connected to a dynamic species dataset.
- Search, filtering, sorting, and pagination are not implemented.
- “Add to collection” buttons do not perform any write action yet.
- No species detail page route is implemented.

## Related Files

- `src/features/encyclopedia/pages/Encyclopedia.tsx`
- `src/features/encyclopedia/components/SpeciesCard.tsx`
- `src/features/encyclopedia/components/SpeciesListItem.tsx`
- `src/App.tsx`
