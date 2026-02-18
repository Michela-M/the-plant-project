# `Firebase Setup`

## Purpose

This project uses Firebase for:

- Authentication (email/password)
- Firestore (plant data)
- Storage (plant images)

This guide explains the minimum setup needed to run the app locally.

## 1) Create a Firebase Project

1. Go to Firebase Console.
2. Create a new project.
3. (Optional) Enable Google Analytics.
4. Add a Web App to the project.
5. Copy the Firebase config values from the app settings.

## 2) Enable Authentication

1. Open Authentication in Firebase Console.
2. Go to Sign-in method.
3. Enable Email/Password provider.

Without this, login and sign-up will fail.

## 3) Enable Firestore Database

1. Open Firestore Database.
2. Create database (start in test mode for local development).
3. Choose a region close to your users.

This app currently stores collection data in the `test-plants` collection.

## 4) Enable Storage

1. Open Storage.
2. Create/default bucket.
3. Choose a region.

Image uploads use Firebase Storage.

## 5) Configure Environment Variables

Create a `.env` file in project root and add:

```dotenv
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

You can copy from `.env.example` and replace placeholders.

### Required vs Optional in current code

Required at startup:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`

Also used by Firebase config:

- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## 6) Firestore and Storage Rules (Development)

For local development, use temporary permissive rules and tighten later.

### Firestore (temporary)

```txt
rules_version = '2';
service cloud.firestore {
	match /databases/{database}/documents {
		match /{document=**} {
			allow read, write: if true;
		}
	}
}
```

### Storage (temporary)

```txt
rules_version = '2';
service firebase.storage {
	match /b/{bucket}/o {
		match /{allPaths=**} {
			allow read, write: if true;
		}
	}
}
```

Do not use these rules in production.

## 7) Verify Setup

1. Start the app: `npm run dev`
2. Open `/signup` and create a test account.
3. Open `/add-plant` and create a plant.
4. Edit a plant and upload an image.
5. Confirm data appears in Firestore and files appear in Storage.

## Common Issues

### `Missing required environment variable`

- Cause: One of the required `VITE_FIREBASE_*` values is missing.
- Fix: Check `.env`, restart dev server after changes.

### Auth errors (`invalid-email`, `operation-not-allowed`)

- Cause: bad credentials or Email/Password provider not enabled.
- Fix: verify values and enable provider in Authentication.

### Firestore permission denied

- Cause: restrictive Firestore rules.
- Fix: update rules for development and publish.

### Storage upload fails

- Cause: Storage not enabled, wrong bucket env value, or restrictive rules.
- Fix: verify Storage setup, bucket name, and rules.

## Related Files

- `src/services/firebase.ts`
- `.env.example`
- `src/features/auth/Login.tsx`
- `src/features/auth/SignUp.tsx`
- `src/features/collection/services/addPlant.tsx`
- `src/features/collection/services/updatePlant.tsx`
- `src/features/collection/services/uploadPlantImage.tsx`
