# 🍞 Baker Buddy

A cozy, mobile-first dough calculator for bread and sourdough, built on baker's percentages. Install it to your home screen as a PWA.

- Set **flour** and **hydration** with two sliders and get exact amounts of flour, water, salt and yeast or starter.
- **Leavening:** instant dry yeast (1%), fresh cube yeast (3%) or sourdough starter (20%, 100% hydration). The starter's flour and water count toward the totals, and the 1 : 1 : 1 starter build is shown.
- **Loaves:** estimated baked weight (≈15% bake loss) and loaf counts that land between 500 g and 2 kg each.
- Metric (default) or imperial, in English, Magyar, Deutsch and Español.
- **Sign in with Google** to save recipes (title + notes) and change your default percentages. Saved recipes are snapshots and keep their own values.

## Defaults

| | Baker's % | Why |
|---|---|---|
| Salt | 2% | The usual lean-dough standard (1.8–2.2%) |
| Instant dry yeast | 1% | Same-day straight dough |
| Fresh yeast | 3% | ≈ 3× instant, by weight |
| Sourdough starter | 20% | Common levain amount, 100% hydration |
| Bake loss | 15% | Home ovens typically lose 10–20% |

The flour slider is **total flour**, including the flour in the starter.

## Development

```bash
npm install
cp .env.example .env.local   # fill in your Firebase web config
npm run dev
npm test
```

Stack: Vite + React + TypeScript, Tailwind CSS, vite-plugin-pwa, Firebase Auth + Firestore, deployed on Vercel.

### Firebase

- `firestore.rules` gives each user access to their own `users/{uid}` document and `recipes` subcollection only. Deploy it with `npx firebase-tools deploy --only firestore,auth`.
- Google sign-in uses the app's own domain as `authDomain`. `vercel.json` proxies `/__/auth/*` to `<project>.firebaseapp.com`, which keeps sign-in working in browsers and installed apps that block third-party storage.
