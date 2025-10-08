## PrimeFreight Tracking API

Express wrapper over upstream tracking APIs with authentication and response sanitization.

### Run

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

Server runs on `http://localhost:3000` by default.

### Health

- GET `/health`

### Base path

- All API endpoints are under `/api/v1`.

### Endpoints

- POST `/api/v1/auth/tokens` — login with username/password, returns Bearer JWT (2h)
- POST `/api/v1/tracking-requests` (proxies upstream)
- GET `/api/v1/tracking-requests/:id` (proxies upstream)
- GET `/api/v1/containers/:containerId` (proxies upstream)
- GET `/api/v1/containers/:containerId/raw-events` (proxies upstream)
- GET `/api/v1/containers/:containerId/transport-events` (proxies upstream)

### Authentication

All `/api/*` routes require a Bearer token.

1) Obtain a token:

```bash
curl -sS \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"username":"primed","password":"freight2025"}' \
  http://localhost:3000/api/v1/auth/tokens
```

Response: `{ "token": "<jwt>", "type": "Bearer", "expiresIn": "2h" }`

2) Call protected endpoints with the token:

```bash
curl -sS \
  -H "Authorization: Bearer <jwt>" \
  http://localhost:3000/api/v1/containers/ABC123
```

Notes:
- Set `JWT_SECRET` in the environment before running the server.
- Unauthorized requests return 401 with an error message.

### Notes

- ESM is enabled (`type: module`).
- Edit or add endpoints in `routes/index.js`.
- Responses are sanitized to remove upstream provider metadata (links, self, href, terminal49 references).
