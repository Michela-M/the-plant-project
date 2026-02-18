# `Collection` Feature Overview

## Description

The collection feature lets users manage their personal plants with create, read, update, and delete workflows backed by Firestore.
It also supports plant image uploads to Firebase Storage and provides toast-based feedback for success and error states.

## Scope

This feature currently includes:

- Collection list view with loading and empty states
- Add plant form
- Plant details view
- Edit plant form (including image upload)
- Plant deletion from plant details header actions
- Firestore-backed data persistence for plant records

## Routes

| Route              | Component      | Purpose                              |
| ------------------ | -------------- | ------------------------------------ |
| `/collection`      | `MyCollection` | Show all plants in the collection    |
| `/add-plant`       | `AddPlant`     | Create a new plant entry             |
| `/plants/:id`      | `PlantDetails` | View details for a single plant      |
| `/plants/:id/edit` | `EditPlant`    | Edit an existing plant and its image |

## Main Flow

### View Collection

1. `MyCollection` loads all plants using `getAllPlants`.
2. A spinner is shown while loading.
3. Plants are rendered as cards ordered by newest first.
4. If no plants exist, an empty-state message is shown.

### Add Plant

1. User fills in the add form (`name`, `species`, `wateringFrequency`, `lastWatered`, `notes`).
2. Formik + Yup validates input.
3. `addPlant` creates a Firestore document in `test-plants`.
4. On success, the form resets, a success toast appears, and user returns to `/collection`.

### View Plant Details

1. `PlantDetails` reads route param `id`.
2. `getPlantDetails` loads the corresponding document.
3. Page renders details header, notes/history section, image preview, and watering schedule.
4. If not found, a fallback message with a link back to `/collection` is shown.

### Edit Plant

1. Existing plant data is fetched and used to prefill form fields.
2. User can update text fields and optionally choose a new image.
3. Selected image is validated and uploaded with `uploadPlantImage`.
4. `updatePlant` saves changes to Firestore.
5. On success, a success toast appears and user is redirected to `/plants/:id`.

### Delete Plant

1. User triggers delete from plant details actions.
2. `deletePlant` removes the Firestore document.
3. UI flow then returns user to collection and reflects updated list.

## Validation Rules

### Add Plant

- `name` is required.
- `wateringFrequency` must be a number >= 0.
- `lastWatered` must be a valid date and cannot be in the future.

### Edit Plant

- `name` is required.
- `wateringFrequency` must be a number >= 0.

### Image Upload

- Image files are validated via `imageValidation` before upload.
- Invalid files show an inline error and prevent upload.

## Data Model (Current Usage)

Collection: `test-plants`

Fields currently used by UI/services:

- `name: string`
- `species: string`
- `wateringFrequency: number`
- `lastWatered: Date | null`
- `notes: string`
- `creationDate: Date`
- `imageUrl: string | null`

## Dependencies

- `firebase/firestore` for plant CRUD operations
- `firebase/storage` for image upload and retrieval
- `formik` for form state and submission
- `yup` for validation schemas
- Toast context (`useToast`) for user feedback

## Error Handling

- Fetch, create, update, delete, and upload failures are surfaced through toast messages.
- Unknown/non-standard errors are normalized to a fallback message.
- Details page handles missing records with a user-friendly “Plant not found” state.

## Current Limitations

- No route-level auth guards; collection routes are not protected yet.
- Plant records are currently stored in a shared `test-plants` collection (not user-scoped in Firestore queries).
- Delete flow does not currently remove any previously uploaded image from Storage.
- History tracking is placeholder-only in details view.

## Related Files

- `src/features/collection/pages/MyCollection.tsx`
- `src/features/collection/pages/AddPlant.tsx`
- `src/features/collection/pages/PlantDetails.tsx`
- `src/features/collection/pages/EditPlant.tsx`
- `src/features/collection/services/getAllPlants.tsx`
- `src/features/collection/services/getPlantDetails.tsx`
- `src/features/collection/services/addPlant.tsx`
- `src/features/collection/services/updatePlant.tsx`
- `src/features/collection/services/deletePlant.tsx`
- `src/features/collection/services/uploadPlantImage.tsx`
