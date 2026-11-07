# TITAN AI Community Guidelines

**Status:** Draft platform policy for TITAN AI. These rules are intended to guide users, moderators, and future product enforcement. They do not replace applicable law or professional advice.

TITAN AI is a video, short-form, music, and AI-creation community. Use it in a way that keeps the platform safe, respectful, lawful, and welcoming.

## 1. Respect people
- Do not bully, threaten, stalk, intimidate, or repeatedly target another person.
- Do not promote hatred or dehumanize people based on protected or personal characteristics.
- Do not share another person's private information, private messages, location, contact details, or images without permission.
- Do not impersonate another person, creator, public figure, or TITAN staff member.

## 2. Protect minors and keep content age-appropriate
- Sexual exploitation, grooming, sexualized depictions of minors, and any sexual content involving minors are prohibited.
- Do not upload or request explicit sexual content.
- Do not encourage self-harm, suicide, dangerous challenges, or harmful eating/fitness behavior.
- Keep titles, thumbnails, comments, and AI-generated content suitable for the intended audience. Apply age restrictions where a future moderation system supports them.

## 3. Dangerous and violent content
- Do not encourage real-world violence, threats, weapon use, or instructions that facilitate harm.
- Do not promote dangerous stunts, hazardous substance use, or challenges likely to cause injury.
- Educational or newsworthy discussion must avoid actionable instructions that enable harm and must be presented responsibly.

## 4. Spam, scams, and platform manipulation
- Do not post repetitive, misleading, or irrelevant spam.
- Do not run scams, phishing, fake giveaways, deceptive monetization offers, or fraudulent links.
- Do not buy, sell, or artificially inflate views, likes, comments, followers, or verification.
- Do not use bots or automation to manipulate engagement or evade platform limits.

## 5. Copyright and creator rights
- Upload only content you created, have permission to use, or are otherwise legally allowed to share.
- Do not repost another creator's work as your own.
- Respect music, film, image, and other intellectual-property rights.
- A report or takedown request should identify the relevant content and explain the rights concern. A formal copyright process must be added before TITAN claims to provide legal takedown handling.

## 6. AI-generated content and authenticity
- Do not use AI tools to impersonate, defraud, harass, or create deceptive intimate imagery.
- Do not present materially synthetic media as authentic evidence when that could mislead or harm people.
- Do not create content that violates the minor-safety, privacy, harassment, or dangerous-content rules above.
- Creators should disclose synthetic or materially altered media when its nature is not obvious and the context could mislead viewers.

## 7. Reporting, blocking, and moderation
- Users should report content that appears to break these rules and block accounts they do not want to interact with.
- Reports should be truthful, specific, and submitted in good faith. Do not use reports to harass others.
- Reports are private and should be reviewed only by authorized moderators or trusted server-side systems.
- Possible actions, depending on severity and review, include content removal, limiting visibility, feature restrictions, temporary suspension, or account termination.
- Users should have a way to appeal significant enforcement decisions. An appeal workflow is not implemented yet.

## 8. Enforcement principles
- Review decisions should consider context, severity, repetition, user safety, and applicable law.
- Immediate safety risks may require urgent action.
- Enforcement must not be represented as automated or active until the moderation service and authorized staff workflow are actually deployed.
- Users should not publish private drafts publicly by changing client-side data. Publishing must be performed by a trusted server-side workflow.

## Current implementation notes
The working branch contains Firestore rules that:
- keep new uploads as private drafts and prevent client-side status changes;
- allow signed-in users to submit private moderation report records with a constrained reason list;
- prevent clients from reading, editing, or deleting report records;
- let each signed-in user manage only their own block-list records.

**Not yet implemented:** report buttons/user interface, moderator dashboard, trusted server-side report review, content scanning, takedown workflow, appeals, account sanctions, age assurance, and automated enforcement. Firestore rules alone do not inspect video/audio/image contents or remove content.
