# TITAN AI — Engineering Status

This document describes the current `backend-foundation` branch. It is not a claim that these features are deployed to production.

## Branch and production safety
- Working branch: `backend-foundation`
- Production branch: `main`
- Production site: `https://titan-ai-app.vercel.app/`
- Branch changes remain isolated until reviewed, merged, and successfully deployed.
- Vercel previously reported the free daily deployment API limit. Do not repeatedly trigger deployment attempts while that platform limit is active.

## Implemented in this branch
- Firestore rules restrict profile ownership, preserve profile creation timestamps, protect video ownership, and limit new uploads to private drafts.
- Firestore rules allow signed-in users to submit private moderation reports with a constrained category list; clients cannot read or alter reports.
- Firestore rules allow users to manage only their own block lists.
- Shorts and long-video cards now offer signed-in users report and block-creator actions; blocked creators are filtered from those feeds for that signed-in user.
- `COMMUNITY_GUIDELINES.md` documents platform standards for safety, minors, harassment, privacy, dangerous content, spam, copyright, AI-generated media, reporting, and enforcement.
- Google sign-in no longer automatically grants a TITAN verified badge.
- Creator Center uploads videos to the configured Cloudinary unsigned preset and writes private draft metadata to Firestore.
- My Videos page lists the signed-in user's video records and lets the owner delete a Firestore record.
- AI endpoint validates request size, language and workflow values, applies a timeout, and does not invent video URLs.
- AI Studio explains that scripts, scene breakdowns and image prompts are available, while finished image/video rendering is not yet connected.

## Not implemented or not verified
- Shorts and long-video feeds read published Firestore records only; uploads remain private drafts and pagination is not implemented.
- No public publish action is exposed. Uploads are private drafts until a trusted server-side review and publishing workflow exists.
- Report/block actions are connected on Shorts and long-video cards. Reporting comments/users, a moderator dashboard, trusted server-side review, appeals, account sanctions, age assurance, and automated content scanning are not implemented.
- Deleting a Firestore draft does not delete its Cloudinary media asset; secure cleanup needs a signed server-side operation.
- Profile sync, followers, notifications, persistent Shorts likes/comments and World Updates provider are incomplete.
- Music page is a demo, not a licensed streaming service.
- AI image generation and actual video rendering providers are not connected.
- No browser/runtime test, Firestore Emulator test, or production deployment test has been completed.

## Required external setup
1. Confirm `GROQ_API_KEY` exists only as a server-side Vercel environment variable.
2. Restrict Cloudinary unsigned preset `Titan-upload` to intended video formats, maximum size and folder. Never expose the API secret.
3. Confirm Google Authentication and authorized domains in Firebase.
4. Confirm Firestore rules in Firebase Console match this branch before testing.
5. Test sign-in, upload, draft listing, delete, owner-only access and sign-out with a test account.
6. Check the Groq vision model name against the provider's current model list before relying on image analysis.

## Next implementation priorities
1. Add Firebase Emulator rules tests and browser smoke tests.
2. Add moderated publishing/review before public uploads enter feeds.
3. Connect Shorts and long-video feeds to approved published records with playback and pagination.
4. Add report/block user interfaces and a trusted moderator review, appeal, and enforcement workflow; then connect persistent likes/comments with sign-in states and abuse controls.
5. Connect profile data to Firestore without self-awarded verification.
6. Connect World Updates to a reputable news provider with attribution and caching.
7. Build music around creator-owned or properly licensed audio.
8. Integrate image/video generation only after selecting a provider with clear costs, limits and account requirements.

## Security reminders
- Keep provider secrets on the server.
- Never use public-write Firestore rules or Firebase test mode in production.
- Browser-side file validation is not a security boundary.
- An unsigned Cloudinary preset is public-facing and must be tightly restricted.
- Do not award a verified badge based solely on Google sign-in.
