# Security

## Trust model

- **Public site**: reads the public Sanity dataset anonymously through the CDN. It holds no token and has no write path.
- **`/admin`**: a static single-page app. Nothing in the app grants access. Sanity checks the token on every request against the signed-in user's project role, and that is the only real gate.
- **Secrets**: none in the repo or the bundle. `projectId` and `dataset` are public identifiers.

## Admin sign-in data flow

| Step | Detail |
|---|---|
| Entry | The user picks a provider on `/admin` and goes to `https://<projectId>.api.sanity.io/.../auth/login/<provider>` with `origin` set to the current admin URL |
| Validation | Sanity returns 403 for an `origin` outside the project's CORS list |
| Return | Sanity redirects back with a single-use `sid`, which `auth.js` removes from the URL straight away |
| Exchange | `GET /auth/fetch?sid=` returns the session token |
| Authorization | `GET /users/me` must return a user. Sanity then enforces roles on every read and write |
| Storage | Token in memory only (module state and React state). It is never written to browser storage or logged |
| Exposure | Sent only as a bearer token to Sanity. User name, email and picture are shown in the admin sidebar |
| Retention | Gone on reload. Sign-out also calls `POST /auth/logout`. A reload without sign-out leaves the server session open until Sanity expires it |

`sanity.io/login` only accepts `localhost` and Sanity's own domains, and `api.sanity.io` rejects other origins, so both are avoided on purpose. The SDK receives the token through its documented `auth.token` option.

## Controls

- Project CORS list with credentials allowed: `http://localhost:5173` and `https://fr3dsz-portfolio.vercel.app`. Keep it to exact origins, never a wildcard.
- `/admin` sends `X-Frame-Options: DENY`. All paths send `X-Content-Type-Options: nosniff` and a strict referrer policy.
- Links from Sanity render only as `http(s):` or `mailto:` (`isSafeUrl` in `src/lib/content.js`).
- Admin code loads in its own chunk, only on `/admin`.

## Known gaps

- Sign-in has no `state` value, so a crafted `/admin?sid=` link could sign someone into the sender's Sanity account. Sanity's roles still apply and the sidebar shows the account name.
- The `sid` is in the first request URL after sign-in, so it can appear in Vercel's request logs. It's single-use.
- A failed sign-out request is ignored, and the session stays open on the server until Sanity expires it.
- There is no Content-Security-Policy.
- The SDK's project lookup on `api.sanity.io` fails from this origin. The admin still renders without it. Its other auth client calls use the project host through `clientFactory`.
- Upload size and file type are checked only by the file picker. Uploading needs a write-capable Sanity account.
- Admin link validation warns but doesn't block publishing. The public site rechecks links.
- `npm audit` reports advisories in build-time packages (`vite`, `postcss`, `source-map-js`), which aren't shipped to visitors.
