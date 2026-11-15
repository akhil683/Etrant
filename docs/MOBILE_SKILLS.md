# Etrant mobile skills

Status: installed
Last updated: 2026-11-10
Scope: skills available to the coding agent for the Etrant React Native build.

## 1. What this document covers

This is the inventory of skills installed for the mobile project. Each entry names the source, what it is for, when to load it, and which delivery phase needs it.

Skills are installed globally at `~/.agents/skills` and linked to the OpenCode agent. The source of truth for versions is `~/.agents/.skill-lock.json`. The project does not vendor skill files.

Five skills were already present before this work: `architect`, `unslop`, `find-skills`, `frontend-design`, and `seo-audit`. The rest were added for this build. The global set now has 50 skills, 13 of them focused on design polish and review.

## 2. How to use the set

Load the narrowest skill that matches the task. Do not load the whole set.

Order of precedence:

1. `expo-overview` for any Expo or EAS task. It routes to the correct expo skill.
2. The specific expo skill for the subsystem, such as `expo-router` or `expo-data-fetching`.
3. `react-native-best-practices`, `vercel-react-native-skills`, `react-native-design`, `animate-expo`, and `gestures` for performance, component, and motion rules.
4. `expo-native-ui`, `expo-design-system`, `frontend-design`, `impeccable`, `emil-design-eng`, `apple-design`, `better-typography`, `better-colors`, and `better-layout` for screens and visual polish.
5. `interface-review`, `review-animations`, `break-ui`, and `better-accessibility` before a screen is called done.
6. `architect`, `react-native-architecture`, and `codebase-design` for structure and module boundaries.
7. `postgres-drizzle` for backend and data work. `dodo-payments` is for the web app, not the mobile app.
8. `maestro-mobile-testing`, `react-native-testing`, and `tdd` for tests.
9. `technical-writing` and `unslop` for docs and release notes.
10. `app-store-optimization` and `seo-audit` for store listings and the marketing site.

## 3. Mobile framework and runtime

| Skill | Source | Use it for | Load when | Phase |
| --- | --- | --- | --- | --- |
| `expo-overview` | `expo/skills` | Entry point for every Expo and EAS task, shared setup rules, routing to the right expo skill | Any request that mentions Expo, EAS, Expo Go, or an `expo-*` package | 0 to 6 |
| `expo-project-structure` | `expo/skills` | Folder layout for a new Expo Router app | Scaffolding `mobile/` | 1 |
| `expo-router` | `expo/skills` | File routes, groups, dynamic routes, stacks, tabs, modals, headers, deep links | Building navigation or screen files | 1 to 4 |
| `expo-data-fetching` | `expo/skills` | Fetch, React Query, caching, offline, loading and error states, route loaders | Any network call or cache change | 1 to 5 |
| `expo-native-ui` | `expo/skills` | Apple HIG styling, semantic colors, native controls, media, safe areas | Building screens and platform polish | 1 to 5 |
| `expo-design-system` | `expo/skills` | Tokens, theme, component variants, design-system drift | Setting up the theme or auditing styles | 1 and 5 |
| `expo-animation` | `expo/skills` | Reanimated, Gesture Handler, transitions, sheets, press feedback, haptics | Reels, sheets, chat, tab transitions | 2 to 5 |
| `expo-web-to-native` | `expo/skills` | Porting a Next.js React app to native, mapping DOM and CSS idioms | Deciding how much web code to reuse | 1 |
| `eas-app-stores` | `expo/skills` | EAS Build, TestFlight, Play Console, signing, versions, submissions | Release setup and store submission | 0, 5, 6 |
| `vercel-react-native-skills` | `vercel-labs/agent-skills` | List performance, Reanimated patterns, images, native modules, monorepo layout | Writing or reviewing React Native components | 1 to 5 |
| `react-native-best-practices` | `callstackincubator/agent-skills` | FPS, TTI, bundle size, memory leaks, re-renders, Hermes, FlashList | Profiling or fixing jank | 2 to 5 |
| `react-navigation` | `callstackincubator/agent-skills` | Stack, tab, and drawer patterns, headers, sheets, safe areas | If a screen uses React Navigation directly instead of Expo Router | 1 to 4 |
| `react-native-architecture` | `wshobson/agents` | Production app structure, offline sync, native modules, cross-platform patterns | Designing the app shell and data layer | 0 and 1 |

## 4. Architecture and design process

| Skill | Source | Use it for | Load when | Phase |
| --- | --- | --- | --- | --- |
| `architect` | `backnotprop/pstack` | Types, signatures, module boundaries, design candidates, implementation against a sketch | Designing a subsystem before code | 0 to 5 |
| `arena` | `backnotprop/pstack` | Parallel design candidates and synthesis | Two or more viable shapes for a module | 0 to 3 |
| `interrogate` | `backnotprop/pstack` | Adversarial review, blind spots, stress testing a design or diff | Before a risky merge or a launch gate | 0, 5 |
| `how` | `backnotprop/pstack` | Code walkthroughs, ownership, placement, layering | Before changing an unfamiliar subsystem | 0 to 3 |
| `why` | `backnotprop/pstack` | Design rationale, regressions, thresholds | When a decision or constraint is unclear | 0 to 5 |
| `codebase-design` | `mattpocock/skills` | Deep modules, seams, interface depth, testability | Designing the API client, session module, or chat store | 0 and 1 |
| `domain-modeling` | `mattpocock/skills` | Glossary, domain terms, ADRs | Naming sessions, entitlements, attempts, outbox | 0 |
| `to-spec` | `mattpocock/skills` | Turn the conversation into a written spec | Before a multi-day feature | 0 to 3 |
| `implement-spec` | `mattpocock/skills` | Implement an approved spec | After a spec is agreed | 1 to 5 |
| `principle-prove-it-works` | `backnotprop/pstack` | Verify against the real artifact, not a proxy | Before declaring a phase done | 0 to 6 |

## 5. Design and visual quality

| Skill | Source | Use it for | Load when | Phase |
| --- | --- | --- | --- | --- |
| `frontend-design` | `anthropics/skills` | Aesthetic direction, typography, avoiding templated defaults | First pass on any new screen | 1 to 5 |
| `expo-native-ui` | `expo/skills` | Native look and feel, HIG, semantic colors, controls | Every screen pass | 1 to 5 |
| `expo-design-system` | `expo/skills` | Tokens, component variants, consistency audits | Theme setup and polish | 1 and 5 |
| `brand-guidelines` | `anthropics/skills` | Brand colors and typography rules | Only if Etrant adopts a formal brand guide | 5 |
| `theme-factory` | `anthropics/skills` | Theme generation for artifacts, store images, decks | Store screenshots and marketing assets | 6 |
| `expo-animation` | `expo/skills` | Motion and haptics that feel native | Reels, answer feedback, sheets | 2 to 5 |

`brand-guidelines` and `theme-factory` are Anthropic examples. They are useful for marketing artifacts, not for the app theme. The app theme comes from `app/globals.css` and `expo-design-system`.

### 5.1 Polish, critique, and platform craft

These skills exist to stop the app from looking like a default AI build. Use them on every screen pass, not only at the end.

| Skill | Source | Use it for | Load when | Phase |
| --- | --- | --- | --- | --- |
| `impeccable` | `pbakaus/impeccable` | Design, redesign, audit, polish, simplify, harden, critique, animate, and capture a design system. Explicitly covers native iOS and Android screens, hierarchy, typography, color, motion, UX copy, accessibility, responsive behavior, empty states, and edge cases. | Any screen that looks generic, or a full design pass | 1 to 6 |
| `emil-design-eng` | `emilkowalski/skills` | UI polish philosophy, component design, animation decisions, and the invisible details that make software feel finished | Reviewing craft and micro-details | 1 to 5 |
| `apple-design` | `emilkowalski/skills` | Apple design foundations, gesture-driven UI, springs, drag and sheet interactions, momentum, materials, typography, reduced motion. Written for the web, so apply the principles through `expo-native-ui` and `animate-expo`. | iOS feel and motion decisions | 2 to 5 |
| `react-native-design` | `wshobson/agents` | React Native styling, navigation, Reanimated, and cross-platform patterns | Building or reviewing RN screens | 1 to 5 |
| `better-typography` | `jakubkrehel/skills` | Type scale, spacing, font features, wrapping, truncation, punctuation | Setting type or reviewing text rendering | 1 and 5 |
| `better-colors` | `jakubkrehel/skills` | Palettes, semantic tokens, contrast, color formats | Theme, dark mode, and contrast checks | 1 and 5 |
| `better-layout` | `jakubkrehel/skills` | Grouping, alignment, reading order, responsive structure, RTL and translated text | Screen layout, tablets, and long copy | 1 and 5 |
| `better-accessibility` | `jakubkrehel/skills` | Focus, labels, forms, screen-reader announcements, motion, zoom, WCAG 2.2. Written for web, so pair it with `expo-native-ui` for native labels, roles, and focus order. | Accessibility pass before release | 5 |
| `animate-expo` | `emilkowalski/skills` | Reanimated, Gesture Handler, Expo Router transitions, press feedback, haptics | Reels, sheets, chat, tab transitions | 2 to 5 |
| `gestures` | `emilkowalski/skills` | Drag, swipe, fling, sheets, pull to refresh, hold to confirm, interruptible motion | Reels, sheets, swipe actions | 2 to 5 |
| `break-ui` | `emilkowalski/skills` | Worst-case data: long names, unbreakable emails, emoji, missing fields, zero items, extreme numbers | Before a screen is called done | 2 to 5 |
| `interface-review` | `jakubkrehel/skills` | Review a branch, pull request, or uncommitted change for interface regressions across accessibility, layout, writing, typography, color, and UI | Before every merge | 2 to 6 |
| `review-animations` | `emilkowalski/skills` | High-bar review of motion code, with a default to flag | After motion work | 2 to 5 |

`impeccable` includes a critique mode. There is no separate `critique` skill folder. Invoke `impeccable` and ask for a critique, or load its `reference/critique.md`.

## 6. Backend, data, and billing

| Skill | Source | Use it for | Load when | Phase |
| --- | --- | --- | --- | --- |
| `postgres-drizzle` | `ccheney/robust-skills` | Postgres schema, Drizzle relations, indexes, pooling, query performance | Schema changes, new tables, slow queries | 0 and 4 |
| `dodo-payments` | `dodopayments/skills` | Dodo checkout, subscriptions, webhooks, customer portal | Web billing work only | Web |
| `typescript-best-practices` | `backnotprop/pstack` | Type safety across `.ts` and `.tsx` | Every code change | 0 to 5 |
| `tdd` | `backnotprop/pstack` | Failing test first, regression tests | Auth, scoring, outbox, webhook handlers | 0 to 5 |

`dodo-payments` is for the web app. The mobile app has no billing, no checkout, and no entitlement screen.

## 7. Testing and verification

| Skill | Source | Use it for | Load when | Phase |
| --- | --- | --- | --- | --- |
| `react-native-testing` | `callstack/react-native-testing-library` | RNTL component tests, queries, matchers, async patterns | Writing component tests | 1 to 5 |
| `maestro-mobile-testing` | `tovimx/maestro-mobile-testing-skill` | YAML flows, test IDs, auth state, optimistic update checks, CI | E2E flows and release checks | 5 and 6 |
| `tdd` | `backnotprop/pstack` | Test-first loop | Business logic and bug fixes | 0 to 5 |
| `principle-prove-it-works` | `backnotprop/pstack` | Real artifact verification | Phase exits | 0 to 6 |

## 8. Writing and discovery

| Skill | Source | Use it for | Load when | Phase |
| --- | --- | --- | --- | --- |
| `technical-writing` | `backnotprop/pstack` | Specs, architecture docs, release notes, runbooks | Writing project docs | 0 to 6 |
| `unslop` | `backnotprop/pstack` | Remove AI tells from prose | Editing docs, store copy, release notes | 0 to 6 |
| `find-skills` | `vercel-labs/skills` | Find and install new skills | A task needs a capability the set does not cover | Any |
| `app-store-optimization` | `dpearson2699/swift-ios-skills` | ASO, keywords, subtitle, screenshots, ratings prompts | Store listing and launch | 5 and 6 |
| `seo-audit` | existing | Technical SEO for the web app and landing pages | Marketing site changes | 5 and 6 |

## 9. Install commands

These commands reproduce the current global install. They target the OpenCode agent only.

```bash
# Mobile framework
npx skills add expo/skills@expo-overview -g -y -a opencode
npx skills add expo/skills@expo-project-structure -g -y -a opencode
npx skills add expo/skills@expo-router -g -y -a opencode
npx skills add expo/skills@expo-data-fetching -g -y -a opencode
npx skills add expo/skills@expo-native-ui -g -y -a opencode
npx skills add expo/skills@expo-design-system -g -y -a opencode
npx skills add expo/skills@expo-animation -g -y -a opencode
npx skills add expo/skills@expo-web-to-native -g -y -a opencode
npx skills add expo/skills@eas-app-stores -g -y -a opencode
npx skills add vercel-labs/agent-skills@vercel-react-native-skills -g -y -a opencode
npx skills add callstackincubator/agent-skills@react-native-best-practices -g -y -a opencode
npx skills add callstackincubator/agent-skills@react-navigation -g -y -a opencode
npx skills add wshobson/agents@react-native-architecture -g -y -a opencode

# Architecture and process
npx skills add backnotprop/pstack@architect -g -y -a opencode
npx skills add backnotprop/pstack@arena -g -y -a opencode
npx skills add backnotprop/pstack@interrogate -g -y -a opencode
npx skills add backnotprop/pstack@how -g -y -a opencode
npx skills add backnotprop/pstack@why -g -y -a opencode
npx skills add mattpocock/skills@codebase-design -g -y -a opencode
npx skills add mattpocock/skills@domain-modeling -g -y -a opencode
npx skills add mattpocock/skills@to-spec -g -y -a opencode
npx skills add mattpocock/skills@implement-spec -g -y -a opencode
npx skills add backnotprop/pstack@principle-prove-it-works -g -y -a opencode

# Design
npx skills add anthropics/skills@frontend-design -g -y -a opencode
npx skills add anthropics/skills@brand-guidelines -g -y -a opencode
npx skills add anthropics/skills@theme-factory -g -y -a opencode
npx skills add pbakaus/impeccable@impeccable -g -y -a opencode
npx skills add emilkowalski/skills@emil-design-eng -g -y -a opencode
npx skills add emilkowalski/skills@apple-design -g -y -a opencode
npx skills add emilkowalski/skills@animate-expo -g -y -a opencode
npx skills add emilkowalski/skills@gestures -g -y -a opencode
npx skills add emilkowalski/skills@break-ui -g -y -a opencode
npx skills add emilkowalski/skills@review-animations -g -y -a opencode
npx skills add jakubkrehel/skills@better-typography -g -y -a opencode
npx skills add jakubkrehel/skills@better-colors -g -y -a opencode
npx skills add jakubkrehel/skills@better-layout -g -y -a opencode
npx skills add jakubkrehel/skills@better-accessibility -g -y -a opencode
npx skills add jakubkrehel/skills@interface-review -g -y -a opencode
npx skills add wshobson/agents@react-native-design -g -y -a opencode

# Backend and billing
npx skills add ccheney/robust-skills@postgres-drizzle -g -y -a opencode
npx skills add dodopayments/skills@dodo-payments -g -y -a opencode
npx skills add backnotprop/pstack@typescript-best-practices -g -y -a opencode
npx skills add backnotprop/pstack@tdd -g -y -a opencode

# Testing
npx skills add callstack/react-native-testing-library@react-native-testing -g -y -a opencode
npx skills add tovimx/maestro-mobile-testing-skill@maestro-mobile-testing -g -y -a opencode

# Writing and discovery
npx skills add backnotprop/pstack@technical-writing -g -y -a opencode
npx skills add backnotprop/pstack@unslop -g -y -a opencode
npx skills add vercel-labs/skills@find-skills -g -y -a opencode
npx skills add dpearson2699/swift-ios-skills@app-store-optimization -g -y -a opencode
```

The `seo-audit` skill was already installed and has no public package command in this document. Keep it as is.

## 10. Skills considered but not installed

| Skill | Why not |
| --- | --- |
| `designed-by-ai/skills@design-mobile-apps` | Requires a `SLEEK_API_KEY` and a paid third-party design service. The project already has a design language. |
| `uizze.sh@ios-design` | The package name does not resolve to a GitHub repository. |
| `uizze.sh@ui-taste` | The package name does not resolve to a GitHub repository. |
| `leonxlnx/taste-skill@high-end-visual-design` | Aimed at landing pages and company websites. The native design skills fit the app better. |
| `wshobson/agents@mobile-ios-design` | SwiftUI-specific. `apple-design` and `react-native-design` cover the design principles without the SwiftUI code. |
| `wshobson/agents@mobile-android-design` | Jetpack Compose-specific. `expo-native-ui` and `react-native-design` cover the Material 3 guidance that applies to React Native. |
| `wondelai/skills@microinteractions` | `animate-expo` and `emil-design-eng` cover the same ground with React Native examples. |
| `callstackincubator/agent-skills@upgrading-react-native` | Install only when upgrading the React Native version. |
| `callstackincubator/agent-skills@create-react-native-library` | The project is an app, not a library. |
| `expo/skills@expo-module` | Install only when writing a custom native module. |
| `expo/skills@expo-dev-client` | Covered by `expo-overview` and `eas-app-stores` for this build. |
| `expo/skills@expo-brownfield` | The app is greenfield, not a native app with embedded React Native. |
| `playwright-best-practices` | Web only. Maestro covers the mobile E2E path. |
| `detox` | Maestro is simpler to run and covers the required flows. |
| `stripe-integration` | The web uses Dodo, not Stripe. |
| `better-auth` | The web uses NextAuth. Replacing it is out of scope. |

## 11. Skill workflow by phase

| Part | Load first | Load next | Exit check |
| --- | --- | --- | --- |
| 0. Backend foundation | `architect` | `postgres-drizzle`, `typescript-best-practices`, `tdd`, `how`, `why` | `principle-prove-it-works` |
| 1. Expo setup | `expo-overview` | `expo-project-structure`, `expo-router` | `principle-prove-it-works` |
| 2. Dependencies | `expo-overview` | `expo-data-fetching`, `expo-design-system`, `expo-animation` | `principle-prove-it-works` |
| 3. Authentication | `expo-data-fetching` | `react-native-best-practices`, `tdd`, `typescript-best-practices` | `principle-prove-it-works` |
| 4. Design system | `impeccable` | `expo-native-ui`, `expo-design-system`, `frontend-design`, `better-typography`, `better-colors`, `better-layout`, `react-native-design` | `principle-prove-it-works` |
| 5. API client | `expo-data-fetching` | `typescript-best-practices`, `codebase-design` | `principle-prove-it-works` |
| 6. Digest | `expo-router` | `better-typography`, `expo-data-fetching`, `react-native-testing` | `principle-prove-it-works` |
| 7. Questions and date range | `expo-animation` | `animate-expo`, `gestures`, `vercel-react-native-skills`, `react-native-best-practices`, `break-ui` | `principle-prove-it-works` |
| 8. Scoring and leaderboard | `expo-data-fetching` | `tdd`, `react-native-testing`, `typescript-best-practices` | `principle-prove-it-works` |
| 9. Subscription handoff | `dodo-payments` | `expo-data-fetching`, `impeccable` | `principle-prove-it-works` |
| 10. Profile and settings | `expo-router` | `react-native-testing`, `better-accessibility` | `principle-prove-it-works` |
| 11. Offline and performance | `react-native-best-practices` | `expo-data-fetching`, `interface-review`, `review-animations`, `better-accessibility` | `principle-prove-it-works` |
| 12. Testing | `maestro-mobile-testing` | `react-native-testing`, `tdd`, `principle-prove-it-works` | `maestro-mobile-testing` |
| 13. Release | `eas-app-stores` | `app-store-optimization`, `technical-writing` | Store review checklist |
| 14. Launch | `principle-prove-it-works` | `technical-writing`, `unslop` | Production check |

## 12. Maintenance

List installed skills:

```bash
npx skills list -g
```

Update all global skills:

```bash
npx skills update -g
```

Update one skill:

```bash
npx skills update expo-router -g
```

Remove a skill:

```bash
npx skills remove expo-router -g
```

Check for a new capability:

```bash
npx skills find "your query"
```

Review the skill before installing it. Check the install count, the source repository, and the security report printed by the CLI.

`seo-audit` is present in `~/.agents/skills` but not tracked in the lock file. It was installed outside the CLI. Reinstall it from its original source if you need version tracking and updates.

## 13. Notes for the next agent

- Read `docs/MOBILE_ARCHITECTURE.md` before touching mobile code.
- Read `docs/MOBILE_BUILD_PLAN.md` for the order of work and the exit check for each part.
- The mobile app calls the existing API. Do not add a second backend.
- Do not connect the app to Neon directly.
- The app has auth, scoring, subscription, and leaderboard. Do not add groups, chat, file uploads, or on-demand AI.
- Do not add in-app purchase. The web handles billing through Dodo.
- Questions are generated by the nightly cron, never by the app.
- Load `expo-overview` before any Expo task. It prevents version and setup mistakes.
- Use `react-native-best-practices` when a list, animation, or image feels slow.
- Use `maestro-mobile-testing` before a release, not after.
- Before calling a screen done, run `impeccable` for a critique, `break-ui` for worst-case data, and `interface-review` on the diff.
- When a screen looks generic, load `better-typography`, `better-colors`, and `better-layout` before changing the layout.
- Use `animate-expo` and `gestures` for motion and touch. Run `review-animations` before merging motion work.
- Use `apple-design` for iOS feel and `react-native-design` for cross-platform structure. Do not copy SwiftUI or Compose code from generic mobile design skills.
