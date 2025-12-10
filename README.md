# Square Inventory Wrapper

## Setup
- Install dependencies: `npm install`
- Create `.env` with `VITE_API_URL=https://your-api-base`

## Development
- Start dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`

## API Expectations
- Inventory load: `GET {VITE_API_URL}/api/inventory` should return an array of products shaped like `src/types.ts`.
- Updates: `PUT {VITE_API_URL}/api/product/:sku` accepts partial product data (sends `currentStock` updates from the UI). On failure, the app falls back to mock data for browsing only.
