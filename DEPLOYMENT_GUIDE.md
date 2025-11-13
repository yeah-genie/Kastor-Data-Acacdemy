## Kastor Data Academy Deployment Guide

### 1. Prerequisites

- Node.js 18+
- npm 9+
- Environment variables
  - `VITE_API_BASE_URL`
  - `VITE_SENTRY_DSN` (optional)
  - `VITE_APP_ENV` (`development` / `staging` / `production`)

Create a `.env.production` file with the variables above.

### 2. Install and build

```bash
npm install
npm run build
```

The production bundle is generated inside `client/dist`.

### 3. Preview build locally

```bash
npm run preview
```

The preview server respects `VITE_APP_ENV` and serves the optimized bundle.

### 4. Deploy targets

| Target | Command | Notes |
| ------ | ------- | ----- |
| Static hosting (Netlify, Vercel, S3) | Upload `client/dist` | Ensure SPA fallback to `index.html` |
| Docker | `docker build -f Dockerfile.prod -t kastor-academy .` | Provide Dockerfile that copies `client/dist` into nginx |
| Node SSR | Set `VITE_APP_ENV=production` and serve using Express + `sirv` |

### 5. Post-deploy checklist

- ✅ API URL resolves correctly (check network tab).
- ✅ Browser console has no errors.
- ✅ Service workers/cache invalidated (force refresh).
- ✅ Accessibility audit passes (Lighthouse score ≥ 90).
- ✅ Monitor Sentry (if configured) for runtime exceptions.

### 6. Useful scripts

```bash
npm run lint     # static checks
npm run test     # unit/integration tests (add when ready)
npm run format   # format using prettier
```

Update `package.json` scripts as the tooling expands.
