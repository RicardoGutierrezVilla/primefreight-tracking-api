import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { apiKeyAuth } from './auth.js';
import { issueToken } from './jwt.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve Swagger UI (static)
const docsDir = path.join(__dirname, '..', 'docs');
// Loosen CSP only for /docs so Swagger can load CDN assets
try {
  // Helmet v8 exposes contentSecurityPolicy; guard in case of changes
  if (helmet.contentSecurityPolicy) {
    app.use(
      '/docs',
      helmet.contentSecurityPolicy({
        useDefaults: true,
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          "script-src": ["'self'", 'https://unpkg.com'],
          "style-src": ["'self'", 'https://unpkg.com', "'unsafe-inline'"],
          "img-src": ["'self'", 'data:'],
          "connect-src": ["'self'", 'https://api.primefreight.com', 'http://localhost:3000'],
        },
      })
    );
  }
} catch (_) {}
app.use('/docs', express.static(docsDir));
app.get('/swagger', (req, res) => res.redirect('/docs/swagger.html'));

// Health check
app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok', service: 'primefreight-tracking-api' });
});

// Username/password login -> issues Bearer token (2 hours)
app.post('/auth/tokens', (req, res) => {
    const { username, password } = req.body || {};
    if (username !== 'primed' || password !== 'freight2025') {
        return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
    }
    try {
        const token = issueToken({ sub: username }, { expiresIn: '2h' });
        return res.status(201).json({ token, type: 'Bearer', expiresIn: '2h' });
    } catch (err) {
        console.error('Prime Freight token issuance error:', err);
        return res.status(500).json({ error: 'Internal Server Error', message: 'Token issuance failed' });
    }
});

// Routes (protected)
app.use('/', apiKeyAuth, (await import('../routes/index.js')).default);

// 404 handler
app.use((req, res) => {
	res.status(404).json({ error: 'Not Found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
