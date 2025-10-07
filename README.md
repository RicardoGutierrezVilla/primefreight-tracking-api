## PrimeFreight Tracking API (Boilerplate)

Minimal Express server with placeholder endpoints for Postman testing.

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

### Endpoints (placeholders)

- POST `/api/tracking-requests`
  - Body: any JSON; echoes back in `data` field
  - 201 Created

- GET `/api/tracking-requests/:id`
  - 200 OK with `{ id }`

- GET `/api/containers/:containerId`
  - 200 OK with `{ containerId }`

- GET `/api/containers/:containerId/raw-events`
  - 200 OK with `{ containerId, events: [] }`

- GET `/api/containers/:containerId/transport-events`
  - 200 OK with `{ containerId, events: [] }`

### Notes

- ESM is enabled (`type: module`).
- Edit or add endpoints in `routes/index.js`.


