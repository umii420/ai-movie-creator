# TITAN AI — Backend Foundation

This branch adds the first security foundation for Firebase Firestore and Firebase Storage. It does **not** activate cloud uploads by itself and does not change the live Vercel deployment.

## What is included

- Firestore rules for private creator profiles, video metadata, comments, and likes.
- Storage rules for authenticated users' video files (under 100 MB) and thumbnails (under 10 MB).
- `firebase.json` so Firebase CLI can deploy these rules.

## Required one-time Firebase setup

Use the Firebase project already referenced by `app-auth-system.js`:

1. Open the Firebase console and select project `titan-ai-2ed23`.
2. In **Build → Firestore Database**, create the database. Choose a location carefully; Firebase does not make changing it easy later.
3. In **Build → Storage**, enable the default Storage bucket.
4. In **Authentication → Sign-in method**, confirm Google is enabled.
5. Install Firebase CLI on a trusted computer, sign in, and run:
   ```sh
   firebase use titan-ai-2ed23
   firebase deploy --only firestore:rules,storage
   ```
6. Confirm the rules are published in Firebase Console.

## Data model

- `users/{uid}`: creator profile fields only; readable and writable by that account.
- `videos/{videoId}`: metadata. Drafts are owner-only; published items are readable by signed-in users. Each document must include `ownerUid`, `title`, `description`, `type` (`short` or `long`), `category`, `storagePath`, `status`, `createdAt`, and `updatedAt`.
- `videos/{videoId}/comments/{commentId}`: comments authored by the signed-in user, up to 500 characters.
- `videos/{videoId}/likes/{uid}`: one like document per account.
- Video files: `users/{uid}/videos/{fileName}`.
- Thumbnails: `users/{uid}/thumbnails/{fileName}`.

## Important limitations / next implementation step

- The existing Creator Center still saves drafts in the browser's IndexedDB/localStorage. It has not yet been switched to Firebase Storage/Firestore.
- The Shorts page still uses demo cards. It has not yet been switched to a Firestore feed.
- Profile display/edit still uses localStorage. Cross-device profile sync is not wired yet.
- These rules deliberately require authentication and restrict each user to their own uploads. They do not make content publicly downloadable from Storage; the first implementation should add an authenticated playback flow or a carefully designed published-media access policy.
- No service-account private key or admin credential belongs in GitHub or browser JavaScript.
- A creator must not receive a verified badge merely by signing in. Verification needs a separate trusted approval flow.

## Safety note

Do not loosen rules to public write access. Never use test-mode Firestore or Storage rules for a production app.
