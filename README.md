# SmartSchool Frontend — Phase 3

Angular 20 (standalone components) + Bootstrap 5 app shell, wired to the Phase 1/2 backend's auth API.

## What's in this phase

- Angular 20 project, standalone components throughout (no NgModules)
- Bootstrap 5 + Bootstrap Icons
- A deliberate design system (not default Bootstrap blue): navy/amber/paper "digital diary" palette, Inter + Manrope fonts — tokens live in `src/styles/_tokens.scss`
- Feature-based folder structure: `core/` (guards, interceptors, services, models), `shared/` (toast notifications), `layout/` (sidebar, topbar, shell), `features/` (auth, and one dashboard placeholder per role)
- Full login flow wired to `POST /api/auth/login`, with:
  - Access token held in memory only (never localStorage — that's an XSS risk)
  - Refresh token handled automatically via httpOnly cookie
  - `authInterceptor` attaches the token to every API call
  - `errorInterceptor` catches a 401, silently refreshes once, retries the original request, and only logs the user out if the refresh itself fails
  - Silent session restore on page reload (`restoreSession()` in `app.config.ts`)
- `authGuard`, `guestGuard`, `roleGuard` — route-level access control (UX only; the backend's own auth/tenant/role checks are the real security boundary)
- Four role dashboards (Super Admin, School Admin, Teacher, Parent) as placeholders — each phase from here fills its own in

## 1. Install

```bash
cd smartschool-frontend
npm install
```

## 2. Point it at your backend

Check `src/environments/environment.development.ts` — it should already say:
```ts
apiUrl: 'http://localhost:4000/api'
```
Change this if your backend runs on a different port.

Also check the backend's `.env`: `CLIENT_URL` must be `http://localhost:4200` (Angular's default dev port) or CORS will block every request.

## 3. Run

Make sure the Phase 1/2 backend is already running (`npm run dev` in `smartschool-backend`), then:

```bash
npm start
```

This runs `ng serve` on `http://localhost:4200`. Open it in a browser — you should see the login screen.

## 4. Log in

Use any of the seeded demo accounts (see the backend's demo data), e.g.:
- **School Admin:** `admin.gvps@smartschool.io` / `Demo@123`
- **Teacher:** `priya.t@greenvalley.edu.in` / `Demo@123`
- **Parent:** `ramesh.p@gmail.com` / `Demo@123`

Or the Super Admin created by `npm run seed` in the backend.

After login you should land on the dashboard matching your role, with the sidebar showing only that role's nav items.

## What to check it's working

- [ ] Login with wrong password → red error message on the form, not a crash
- [ ] Login with correct credentials → redirected to the right dashboard for your role
- [ ] Sidebar shows different nav items for Teacher vs Parent vs School Admin
- [ ] Refresh the browser page while logged in → you stay logged in (silent refresh)
- [ ] Click "Log out" in the topbar → sent back to `/login`
- [ ] Manually visit `/school-admin` while logged in as a Teacher → redirected to `/teacher`, not shown School Admin's page

## Common errors and fixes

| Symptom | Cause | Fix |
|---|---|---|
| CORS error in browser console | Backend `CLIENT_URL` doesn't match `http://localhost:4200` | Fix backend `.env`, restart backend |
| Login request fails with "Network Error" / net::ERR_CONNECTION_REFUSED | Backend isn't running | `npm run dev` in `smartschool-backend` first |
| Stuck on a blank page after login | A dashboard placeholder failed to load — check the browser console | Check exact error; likely a typo if you've started editing files |
| Logged out immediately after a page refresh | Refresh cookie missing/blocked (e.g. testing across different ports without proper CORS credentials) | Confirm both apps run on `localhost` (not `127.0.0.1` mixed with `localhost`), and that `withCredentials` isn't being stripped by a proxy |

## What's intentionally NOT in Phase 3

- No real dashboard widgets yet (stats cards, recent activity) — Phase 4+ per module
- No `GET /api/auth/me` yet, so a page refresh restores the *token* but not the *user profile* shown in the topbar until you navigate somewhere that re-fetches it — this is called out as a TODO in `auth.service.ts` and will be closed out when Phase 4 adds that endpoint
- No forms/tables for students, teachers, homework, etc. — those arrive with their respective backend phases

## Next step

Say **"START PHASE 4"** for the Super Admin backend module (schools CRUD, platform dashboard) — that unlocks building out the first *real* dashboard (Super Admin's) instead of a placeholder.
