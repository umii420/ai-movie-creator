# TITAN AI Comprehensive Audit — 2026-11-22

## Scope and verification level
This audit is based on source-code review of branch `titan-audit-white-cleanup`. It is **not** a browser, Firebase Emulator, or production deployment test. The live Vercel site was not verified during this audit.

## Fixes made during this audit
- `api/world-updates.js`: RSS link extraction now supports plain-text RSS `<link>` elements (which may omit a closing tag) and Atom-style `href` links. Items are still filtered to HTTPS URLs.
- `pages/profile.html`: profile edit URL validation now stops saving when a URL is invalid, identifies the invalid field, and clears stale validation feedback before a new save attempt.

## Feature status

| Feature | Source review status | Remaining work |
|---|---|---|
| Home / navigation | UI and local search/category filters exist | Demo cards are not a real video feed; playback/search backend missing |
| Google authentication | Firebase popup flow and guest UI exist; shell auth listener initializes before SPA navigation | Browser test, redirect flow, logout/session test; guest is a local UI bypass rather than an authenticated account |
| Profile | Local edit UI and basic Firestore sync exist | Extended fields cross-device sync, real follower/following data; verify merge writes against strict profile document-key rules for pre-existing documents |
| Shorts | Feed UI, scroll-snap, report/block controls | Feed publishing, likes/comments, pagination, moderation workflow |
| TITAN Video | Published-record feed/player code exists | Trusted publish flow, search, pagination, runtime Firestore test |
| Upload Center | Cloudinary upload + Firestore private draft; client validation | Preset restrictions, upload recovery, orphan cleanup, server-side validation |
| AI Studio | Script/scene/prompt generation endpoint; endpoint validates prompt, language/category and image data size/type; provider timeout and empty-result handling exist | Actual image/video rendering provider, persistence/export, auth/rate limit; endpoint still has no verified auth or durable rate limit |
| Music | UI/demo states | Real catalogue, playback, licensing, search |
| World Updates | BBC/DW RSS API with cache and timeout; parser link fix committed | Runtime feed verification, category/search, fallback UX |
| Settings | Local preference storage and disclosure | Settings currently do not change all app behavior; account/cloud sync |
| Security | Restrictive Firestore/Storage rules present | Emulator tests, trusted moderation/publishing, API abuse/rate limiting, age/safety workflow |
| Monetization | UI concepts only | Eligibility, verification, payments, fraud controls, payout system |
| Deployment | Not verified | Confirm Vercel project, deployment limits, build, and live commit |

## Additional source-review findings (2026-11-22)
- `api/generate.js` restricts POST, prompt length, image payload size/type, language and category; it uses a 25-second timeout and returns provider errors. Authentication and durable rate limiting are not present.
- The AI Studio UI correctly discloses that image/video rendering is not connected and generated text is not persisted automatically.
- The home catalog and local search/category filter are explicitly preview content; search does not query a backend video catalogue.
- Shorts and TITAN Video query published Firestore videos, but no trusted publishing workflow was found; public feed can remain empty until an authorized process publishes content.
- Guest access is a local gate bypass, not an authenticated Firebase identity. Account-dependent actions still require sign-in.
- The profile cloud-sync path should be runtime-tested against strict Firestore profile document key validation, especially when merging into documents that may contain extra fields.

## Important security and operational findings
- Firebase client config is present in browser code. Firebase API keys are identifiers, not server secrets; security must come from Firebase Auth, rules, authorized domains, and provider restrictions.
- `GROQ_API_KEY` must remain server-side. The generation endpoint currently has no verified authentication or durable rate-limit mechanism.
- Cloudinary unsigned uploads are public-facing. The preset must restrict formats, size, folder, and transformations. Client-side checks can be bypassed.
- A Cloudinary upload can become orphaned if the Firestore draft write fails. Secure cleanup requires a server-side signed operation.
- Publishing must remain unavailable to ordinary browser clients until a trusted moderation/publishing process exists.
- Feed pages may query published records, but no user-facing publish flow is verified.
- Settings choices are disclosed as device-local placeholders and should not be represented as functional account-wide controls.
- No browser smoke test, Firebase Emulator test, or production deployment verification was completed.

## Current deployment status (checked 2026-11-22)
GitHub commit status for the audit branch HEAD reports all six Vercel project checks as failed with the same reason: **deployment rate limited — retry in 24 hours**. This is a Vercel deployment quota/limit status, not evidence of a source-code build error. No deployment was initiated by this audit. The live site and deployed commit remain unverified.

## Additional UI and account findings (2026-11-22)
- Settings stores local preference values but the controls do not apply theme/language/notification/privacy behavior; the page discloses this.
- Music page is a visual preview: search filters preview mood cards, playback is disabled, and no catalog/provider is connected. The page discloses this.
- My Videos deletes the Firestore draft record only. Cloudinary media can remain orphaned; the UI warns users of this.
- Video feed report and block actions are present in source, but Firestore rules and runtime testing still need verification for the complete workflow.

## Branch safety
All changes are on `titan-audit-white-cleanup`. The `main` branch and production deployment were not modified by this audit.


## Bug fix — AI Studio workflow mismatch (2026-11-22)
- **Found:** The API accepted `image`, `scene`, `Titan Shorts`, and `Titan Video` categories but used one generic screenplay instruction for every category. The Image Prompt mode could therefore return a screenplay instead of an image-generation prompt, and other workflows lacked format-specific outputs.
- **Fixed on audit branch:** `api/generate.js` now uses workflow-specific instructions for screenplay, cinematic scene breakdown, standalone image prompt, vertical Shorts concept, and long-form video plan. Image-only input also receives a clearer instruction.
- **Verification:** Source review confirms the category instructions are mapped and the request still uses the existing endpoint/response shape. Runtime provider test is pending; no live deployment was made.


## Bug fix — Creator upload timeout (2026-11-22)
- **Found:** Cloudinary upload XHR had no timeout or abort handling. A stalled request could leave the UI in an uploading state until the browser/network eventually resolved it.
- **Fixed on audit branch:** Upload now has a 120-second timeout and explicit timeout/abort error messages; the existing catch path restores the upload button.
- **Verification:** Source confirms timeout and handlers are present. Network/runtime upload test remains pending.


## Bug fix — guest mode auth gate (2026-11-22)
- **Found:** The guest button only removed the login overlay. Firebase's `onAuthStateChanged(null)` callback then reopened the gate, so guest access could fail to persist.
- **Fixed on audit branch:** Guest choice now stores a local guest-mode flag, the auth listener respects that flag for signed-out sessions, Google sign-in clears guest mode, and logout clears it.
- **Verification:** Source-level flow reviewed. Browser test is pending; this does not grant guests Firebase authentication or account-only permissions.
