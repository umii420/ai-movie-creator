# TITAN AI — Backend Foundation

This branch adds Firestore security rules and connects the Creator Center upload flow to Cloudinary for video files and Firestore for draft metadata. It does **not** change the live Vercel deployment.

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
5. In Cloudinary, keep the `Titan-upload` preset unsigned only if needed for browser uploads, and restrict it in the preset settings: video-only formats, a 100 MB maximum file size, and the intended `titan` folder. Never put the Cloudinary API secret in browser code or GitHub.
6. Install Firebase CLI on a trusted computer, sign in, and run:
   ```sh
   firebase use titan-ai-2ed23
   firebase deploy --only firestore:rules,storage
   ```
7. Confirm the Firestore rules are published in Firebase Console. Firebase Storage is not required for the current Cloudinary upload path; the Storage rules are a future option if Storage is enabled later.

## Data model

- `users/{uid}`: creator profile fields only; readable and writable by that account.
- `videos/{videoId}`: metadata. Drafts are owner-only; published video metadata is publicly readable so a public creator feed can display it. Comments and likes require sign-in. Each document must include `ownerUid`, `title`, `description`, `type` (`short` or `long`), `category`, `storagePath`, `videoUrl`, `status`, `createdAt`, and `updatedAt`.
- `videos/{videoId}/comments/{commentId}`: comments authored by the signed-in user, up to 500 characters.
- `videos/{videoId}/likes/{uid}`: one like document per account.
- Video files currently live in Cloudinary; Firestore stores the Cloudinary `secure_url` in `videoUrl` and the asset identifier in `storagePath`.
- The included Firebase Storage rules are reserved for a future Firebase Storage implementation and are not used by the current Creator Center.

## Important limitations / next implementation step

- The Creator Center uploads video files to Cloudinary and saves draft metadata in Firestore. Drafts are not yet published to the public feed.
- The Shorts page still uses demo cards. It has not yet been switched to a Firestore feed.
- Profile display/edit still uses localStorage. Cross-device profile sync is not wired yet.
- These rules deliberately require authentication and restrict each user to their own uploads. They do not make content publicly downloadable from Storage; the first implementation should add an authenticated playback flow or a carefully designed published-media access policy.
- No service-account private key or admin credential belongs in GitHub or browser JavaScript.
- A creator must not receive a verified badge merely by signing in. Verification needs a separate trusted approval flow.

## Safety note

Do not loosen rules to public write access. Never use test-mode Firestore or Storage rules for a production app.


## Cloudinary upload safety and current limitations

- The browser checks video MIME type and the 100 MB size limit, but client-side checks can be bypassed. Enforce the same limits in the Cloudinary unsigned upload preset itself.
- Unsigned presets are public-facing. Restrict allowed formats, file size, folder, and any transformations in Cloudinary; monitor usage. Do not expose an API secret.
- If Cloudinary accepts a video but the subsequent Firestore write fails, the uploaded Cloudinary asset can remain orphaned. The current browser-only flow cannot securely delete that asset because deletion requires a server-side signed operation. A future server endpoint should handle cleanup.
- Upload completion currently creates a private Firestore draft only. It does not publish to Shorts or long-video feeds.
