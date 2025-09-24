## Single-App Multi-Edition Plan (Telugu + Tamil)

This document is the single source of truth for adding Bigg Boss Tamil
to the existing Bigg Boss Telugu app using a single application bundle.
The plan prioritizes safety (no regressions to Telugu), clear separation
of data, and maintainability.

### Goals
- Add Tamil as a first-class edition alongside Telugu within one app
- Keep current Telugu experience unchanged for existing users
- Allow users to pick edition on first launch and switch later from menu
- Cleanly partition data/ads/analytics/notifications by edition

### Non-goals
- Separate Play Store listing per edition (we ship a single app)
- Full i18n of UI strings (optional future enhancement)

---

## Architecture Overview

- Edition selection is handled at runtime and persisted locally
- Config is edition-aware and exposed via a provider + hooks
- Data, ads, analytics, and notifications are scoped by edition

### Key Concepts
- Edition: `'telugu' | 'tamil'`
- Edition-aware config object with a stable, unified interface
- EditionProvider: global context for `edition`, `setEdition`, `config`

---

## UX Flows

### First-launch picker
- On cold start, if no edition is stored, show EditionPicker
- Options: Telugu (default pre-selected), Tamil
- Persist selection and proceed to app

### Switching editions from menu
- Add menu item: "Change Edition"
- Show the same EditionPicker
- On confirm: cleanly switch runtime scope (see Switching Lifecycle)

---

## Config Design

Files to add:
- `src/config/editions/shared.ts` (app-wide toggles/flags shared by editions)
- `src/config/editions/telugu.ts`
- `src/config/editions/tamil.ts`
- `src/config/index.ts` (selector + hook)

Interface shape (stable across editions):

```ts
// src/config/editions/types.ts
export type Edition = 'telugu' | 'tamil'

export interface EditionConfig {
	ads: {
		bannerId: string
		interstitialId: string
		rewardedId?: string
	}
	firestore: {
		rootPath: string // e.g. 'editions/telugu'
	}
	branding: {
		appTitle: string
		primaryColor: string
		logo: any // image require
	}
}
```

Selector + hook:

```ts
// src/config/index.ts
import { useEdition } from '../context/EditionProvider'
import telugu from './editions/telugu'
import tamil from './editions/tamil'

export function getConfig (edition: 'telugu' | 'tamil') {
	return edition === 'tamil' ? tamil : telugu
}

export function useEditionConfig () {
	const { edition } = useEdition()
	return getConfig(edition)
}
```

Shared flags:
- `FORCE_TEST_ADS` (for UAT only)
- Feature toggles if needed (e.g., Tamil launch banner)

---

## Edition Provider

Add a light provider to own edition state + persistence:

```tsx
// src/context/EditionProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { getItem, setItem } from '../utils/storage' // wraps AsyncStorage

type Edition = 'telugu' | 'tamil'

interface EditionContextValue {
	edition: Edition
	setEdition: (next: Edition) => void
}

const EditionContext = createContext<EditionContextValue | undefined>(undefined)

export function EditionProvider ({ children }: { children: React.ReactNode }) {
	const [edition, setEditionState] = useState<Edition>('telugu')

	useEffect(() => {
		getItem('edition')
			.then(saved => {
				if (saved === 'tamil' || saved === 'telugu') setEditionState(saved)
			})
			.catch(() => {})
	}, [])

	const setEdition = (next: Edition) => {
		setEditionState(next)
		setItem('edition', next).catch(() => {})
	}

	return (
		<EditionContext.Provider value={{ edition, setEdition }}>
			{children}
		</EditionContext.Provider>
	)
}

export function useEdition () {
	const ctx = useContext(EditionContext)
	if (!ctx) throw new Error('useEdition must be used within EditionProvider')
	return ctx
}
```

Wrap the app root with `EditionProvider`.

---

## Data Model & Firestore

Partition data under per-edition roots to avoid cross-contamination:

- Polls: `editions/{edition}/polls`
- Contestants: `editions/{edition}/contestants`
- News: `editions/{edition}/news`
- Optional: `editions/{edition}/promos`, `editions/{edition}/settings`

Service access pattern:

```ts
// src/services/firestore.ts (example usage)
import firestore from '@react-native-firebase/firestore'
import { useEditionConfig } from '../config'

export function usePollsQuery () {
	const { firestore: fs } = useEditionConfig()
	return firestore()
		.collection(`${fs.rootPath}/polls`)
		.orderBy('createdAt', 'desc')
}
```

Migration of existing data:
- Copy current collections into `editions/telugu/...`
- Admin panel tools/scripts can assist bulk copy

Admin panel changes:
- Add edition selector to target paths under the chosen root

---

## Ads & Consent

- Keep a single AdMob App ID in the manifest
- Move ad unit IDs to edition config: `config.ads.bannerId`, `interstitialId`
- Respect `FORCE_TEST_ADS` in shared flags
- Consent flow remains edition-agnostic

`ads.ts` example adaptation:

```ts
// src/services/ads.ts (concept)
import { useEditionConfig } from '../config'

export function useBannerAdUnitId () {
	const { ads } = useEditionConfig()
	return ads.bannerId
}
```

---

## Analytics & Notifications

Analytics
- Set user property `edition`
- Include `edition` as an event param and in screen view metadata

Notifications (FCM)
- Topics per edition: `all-users-telugu`, `all-users-tamil`
- On edition change: unsubscribe from old, subscribe to new

Switch handling snippet:

```ts
async function onEditionChanged (prev: 'telugu' | 'tamil', next: 'telugu' | 'tamil') {
	try {
		await messaging().unsubscribeFromTopic(`all-users-${prev}`)
		await messaging().subscribeToTopic(`all-users-${next}`)
	} catch (err) {}
}
```

---

## Switching Lifecycle (Safety First)

When user confirms a new edition:
1. Persist selection
2. Unsubscribe all Firestore listeners
3. Clear any in-memory caches keyed by edition
4. Switch FCM topics
5. Update analytics user property
6. Recreate listeners with the new root
7. Optionally refresh ads (preload with new unit IDs)

Centralize unsubscribe/re-subscribe in a small runtime manager to avoid leaks.

---

## Error Handling & Fallbacks
- If storage read fails on cold start, default to Telugu and continue
- Guard Firestore paths; never build a path without a validated edition
- Log non-fatal errors; never block main UI on edition failures

---

## Performance Considerations
- Avoid re-render storms by scoping edition state to provider and accessing
  `config` via small hooks
- Debounce rapid edition switches and disable UI during transition
- Keep queries paginated; reuse list views across editions

---

## Testing Plan

Unit
- Config selector returns correct values per edition
- Provider persists/reads edition

Integration
- First-launch picker → correct data/ads load
- Switch edition → listeners rebind, topics switch

Release smoke
- Consent, ads impression, Firestore queries, no runtime errors in release

---

## Rollout & Migration
- Create Tamil config (ad units, branding, rootPath)
- Copy current data to `editions/telugu/*`
- Admin panel updated to write to the partitioned paths
- Ship as a minor version bump; telemetry to monitor switch usage

---

## Work Breakdown (Incremental)

1) Core plumbing
- Add `EditionProvider` + storage persistence
- Add config files and `useEditionConfig()`

2) Data & services
- Move Firestore access to use `config.firestore.rootPath`
- Ensure `news`, `polls`, `contestants` read new paths

3) Ads & consent
- Route ad unit IDs via config
- Keep consent unchanged

4) UI
- Add EditionPicker (first launch)
- Add menu item to change edition

5) Notifications & analytics
- Topic subscribe/unsubscribe on change
- Set analytics user property `edition`

6) Admin panel
- Edition selector; write under selected root

7) QA
- Fresh install flows, switch flows, release build tests

---

## Acceptance Criteria
- Fresh install prompts edition once and persists it
- Switching editions updates lists/feeds/polls without requiring relaunch
- Ads load with correct unit IDs per edition
- Notifications topics aligned with chosen edition
- Analytics tagged with `edition`
- No regressions for Telugu-only path when Tamil is not selected

---

## Risks & Mitigations
- Risk: Partial refactor leaves hard-coded paths → Mitigate with a single
  `useEditionConfig()` source for all services
- Risk: Leaking listeners on switch → Central unsubscribe/rebind helper
- Risk: Incorrect ad unit usage → Unit tests + logging ad unit IDs in dev

---

## Future Enhancements
- Full i18n (string catalogs per edition)
- Per-edition theming (fonts, accent colors)
- Additional editions (Kannada, Hindi) by adding new config files only


