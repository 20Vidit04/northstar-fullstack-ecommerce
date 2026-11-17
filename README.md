# Northstar — Full-Stack Product Catalogue + Admin

A locally runnable React + Vite, Express and SQLite e-commerce product listing project with a protected admin dashboard. Uses **npm**.

## First-time setup (Windows, VS Code)

Install Node.js LTS. Open this folder (`Northstar-Recovery`) in VS Code. Open a terminal in the **backend** folder:

```bat
cd backend
npm install
npm run setup-admin
npm run dev
```

The setup command asks for an admin password (at least 12 characters). Keep this terminal running. In **a second VS Code terminal** starting from the project root:

```bat
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser. Open **Admin dashboard**, then sign in with the password you created. The API health check is **http://localhost:5000/api/health**.

On later runs, you only need `npm run dev` in each folder. Stop both servers with Ctrl+C.

## Admin features

- Create, update, and delete products in SQLite; product data is fetched through the API.
- View opt-in visit counts, pseudonymous IP-derived visitor IDs, masked IP ranges, approximate country codes, timestamps (UTC), first/last seen, and recent page logs.
- Change theme preset, fonts, page background, card background, text and accent colours. Clicking Save **generates `backend/generated-theme.css`** on disk and updates the live website. Settings persist in SQLite.
- Password-protected admin API, login rate limiting, HTTP-only SameSite cookies.

## Privacy and analytics limitations

The site **asks visitors to opt in** before recording visits. Visitor ID is an HMAC of IP using a local secret; it is **not a personal identity**. Different users can share IP addresses and the same user can change IPs. Only a masked IP is saved; a short pseudonymous visitor ID is displayed. Country comes from an offline IP-country database and is approximate. Local/private IPs, VPNs and proxies may display `Unknown`. To protect visitors, obtain appropriate consent, explain retention, and comply with applicable privacy laws before public deployment. This local educational implementation has no automatic retention policy or self-service deletion feature.

## API

Public: `GET /api/health`, `GET /api/products`, `GET /api/products/:id`, `GET /api/categories`, `GET /api/theme`, `GET /api/theme.css`.

Consent-based: `POST /api/visits` with `{ "consent": true, "page": "/" }`.

Admin: `POST /api/admin/login`, `GET /api/admin/me`, `POST /api/admin/logout`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`, `GET /api/admin/analytics`, `GET /api/admin/theme-presets`, `PUT /api/admin/theme`.

## Data and security

- `backend/products.db` is created and seeded on first run.
- `backend/admin-credentials.json` is created by setup and is excluded from Git.
- `backend/analytics-secret.key` is generated on startup and excluded from Git.
- `backend/generated-theme.css` is generated on startup and whenever the theme is saved.
- Vite proxies `/api` to Express, avoiding development CORS problems.
- This is an educational project for **local use**, not a production-hardened e-commerce service. For public deployment, add HTTPS, persistent sessions, CSRF defenses, stronger access controls, privacy/retention controls and a production reverse proxy.

## Important

`OPEN-WEBSITE.html` from an earlier recovery package is not the full-stack site. **Use `http://localhost:5173`** with both npm servers for the new dashboard and analytics.
