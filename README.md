# xrostao deployment notes

## Local setup

1. Install dependencies:
   `npm install`
2. Start the frontend:
   `npm run dev`
3. Start the backend API in another terminal:
   `npm run server`

The frontend uses `VITE_API_BASE_URL` when it is set. Without it, local development falls back to `http://localhost:5000`.

## Render split deployment

Use two separate Render services:

1. Static Site for the frontend
2. Web Service for the API

### Frontend Static Site

- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Environment variables:
  - `VITE_SITE_ORIGIN=https://YOUR-FRONTEND-DOMAIN`
  - `PRERENDER_SITE_ORIGIN=https://YOUR-FRONTEND-DOMAIN`
  - `VITE_API_BASE_URL=https://YOUR-BACKEND-DOMAIN`
  - Firebase `VITE_...` variables

### Backend Web Service

- Build command: `npm install`
- Start command: `npm run server`
- Environment variables:
  - `DATABASE_URL=...`
  - `FRONTEND_ORIGIN=https://YOUR-FRONTEND-DOMAIN`
  - `CORS_ALLOWED_ORIGINS=https://YOUR-FRONTEND-DOMAIN`
  - `SERVE_FRONTEND=false`
  - `ENABLE_PURCHASE=false` or `true`

If you ever want the Node server to serve the built frontend too, set `SERVE_FRONTEND=true`.
