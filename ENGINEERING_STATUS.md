# TITAN AI — Engineering Status

This document describes the current `backend-foundation` branch. It is not a claim that these features are deployed to the production website.

## Branch and production safety

- Working branch: `backend-foundation`
- Production branch: `main`
- Production site: `https://titan-ai-app.vercel.app/`
- Changes on this branch do not appear on the production site until they are reviewed, merged into the configured production branch, and successfully deployed by Vercel.
- Do not repeatedly trigger deployments when Vercel reports its daily deployment limit. A deployment limit is an account/platform limit, not proof of a source-code failure.

## Implemented in this branch

- Firestore rules define owner-only draft access, public reads for published video metadata, and signed-in comment/like operations.
- Google sign-in no longer automatically grants a TITAN verified badge. Verification must be an independent approval process.
- Creator Center uploads video files to the configured Cloudinary unsigned preset and writes draft metadata to Firestore.
- Creator upload UI checks for video MIME type and a 100 MB client-side limit. These checks must also be enforced in the Cloudinary upload preset.
- AI generation endpoint validates request size, language and workflow values, applies a request timeout, and returns a clear error when the provider fails.
- The AI endpoint no longer invents a video URL. It explicitly returns `videoUrl: null` and `videoGenerationAvailable: false` until a real video-rendering provider is integrated.
- AI Studio now tells creators that scripts, scene breakdowns and image prompts are available, while finished image/video rendering is not yet connected.

## Not implemented or not verified

- No real public Shorts feed or long-video feed is connected to Firestore yet.
- Creator uploads are saved as private drafts; there is no complete publish/review workflow.
- Public playback, thumbnails, creator profile sync, follower counts and notifications are not fully connected to a backend.
- Shorts likes/comments on the current demo screen are not persistent server-backed interactions.
- Music page is a presentation/demo screen, not a complete licensed music streaming or upload service.
- World Updates is not connected to a news provider.
- AI image generation and actual video rendering providers are not connected.
- The Cloudinary-to-Firestore upload flow has not been runtime-tested in a deployed environment.
- Firestore rules have not been run through the Firebase Emulator test suite.
- Firebase Storage is not used by the current Cloudinary upload path. Do not enable a paid Firebase plan just to use the unused Storage rules.

## Required external setup and checks

1. Confirm `GROQ_API_KEY` exists as a server-side Vercel environment variable for the intended deployment environment. Never put it in browser JavaScript or commit it to GitHub.
2. In Cloudinary, restrict the unsigned `Titan-upload` preset to intended video formats, maximum size, and the intended folder. Unsigned presets are public-facing; never expose the API secret.
3. Confirm Google Authentication is enabled in Firebase and the authorized domains include the actual test domain.
4. Confirm the Firestore rules shown in Firebase Console match this branch before using the backend.
5. Test sign-in, upload, Firestore draft creation, owner-only draft visibility, and sign-out using a test account.
6. Check the Groq vision model name against the provider's current model list before relying on image analysis; provider model availability can change.

## Recommended implementation order

1. Add automated syntax checks and Firebase Emulator tests for the security rules.
2. Build a Firestore-backed creator draft list and a deliberate publish/unpublish workflow.
3. Connect the public Shorts and long-video feeds to published Firestore records, with safe video playback and pagination.
4. Add persistent likes and comments with clear sign-in states and abuse controls.
5. Connect profile data to Firestore and implement profile editing without allowing users to self-award verification.
6. Add reporting, moderation, upload limits, and a safe content review process before opening public publishing.
7. Integrate real image/video generation only after selecting a provider with clear costs, limits, and age-appropriate account requirements.
8. Connect World Updates to a reputable news source with attribution and caching.
9. Build the music feature around creator-owned or properly licensed audio.

## Important security reminders

- Keep all provider secrets on the server.
- Never use public-write Firestore rules or Firebase test mode in production.
- Treat browser-side file validation as a convenience, not a security boundary.
- A successful Cloudinary upload followed by a failed Firestore write can leave an orphaned asset. Secure cleanup requires a server-side signed Cloudinary operation.
- Do not show a verified badge based solely on Google sign-in.
