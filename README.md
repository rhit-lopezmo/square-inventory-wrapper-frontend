# AoA Inventory Wrapper

## Setup
- Install dependencies: `npm install`
- Create `.env` with:
  - `VITE_API_URL=https://your-api-base`
  - `VITE_FIREBASE_API_KEY=...`
  - `VITE_FIREBASE_AUTH_DOMAIN=...`
  - `VITE_FIREBASE_PROJECT_ID=...`
  - `VITE_FIREBASE_APP_ID=...`

## Development
- Start dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`

## API Expectations
- Inventory load: `GET {VITE_API_URL}/api/inventory` should return an array of products shaped like `src/types.ts`.
- Updates: `PUT {VITE_API_URL}/api/inventory/:sku` accepts partial product data (sends `currentStock` updates from the UI). On failure, the app falls back to mock data for browsing only.

## Authentication
- Firebase Auth (email/password) gates the inventory UI. Configure the Firebase project with Email/Password enabled and supply the env vars above.
- Users see a login/signup screen styled to match the inventory dashboard, and can sign out from the header avatar chip.
