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

- All API endpoints are under `/api`.

### Endpoints

- POST `/api/tracking-requests` (proxies upstream)
- GET `/api/tracking-requests/:id` (proxies upstream)

- GET `/api/tracking-requests/:id`
  - 200 OK with `{ id }`

- GET `/api/containers/:containerId` (proxies upstream)

- GET `/api/containers/:containerId/raw-events` (proxies upstream)

- GET `/api/containers/:containerId/transport-events` (proxies upstream)

### Authentication

All `/api/*` routes require a client token.

1) Client generates a token (they own it):

```bash
# Node
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or OpenSSL
openssl rand -hex 32
```

Send the generated token to Prime Freight to be registered.

2) Prime Freight registers token (Cloud Run example):

```bash
gcloud run services update SERVICE_NAME \
  --update-env-vars API_KEYS=CLIENT_TOKEN_1,CLIENT_TOKEN_2
```

3) Client authenticates subsequent requests:

```bash
# Preferred: Authorization: Token
curl -sS \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"container_id":"ABC123"}' \
  https://YOUR_CLOUD_RUN_HOST/api/tracking-requests

# Alternatively: x-api-key header
curl -sS \
  -H "x-api-key: YOUR_TOKEN" \
  https://YOUR_CLOUD_RUN_HOST/api/tracking-requests/ID
```

Unauthorized requests return 401/403 with a Prime Freight–scoped message.

### Notes

- ESM is enabled (`type: module`).
- Edit or add endpoints in `routes/index.js`.
- Responses are sanitized to remove upstream provider metadata (links, self, href, terminal49 references).


