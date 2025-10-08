import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { apiKeyAuth } from './auth.js';
import { issueToken } from './jwt.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok', service: 'primefreight-tracking-api' });
});

// Admin token issuance (protected by ADMIN_SECRET)
app.post('/auth/tokens', (req, res) => {
    const adminSecret = process.env.ADMIN_SECRET || '';
    const provided = req.headers['x-admin-secret'] || '';
    if (!adminSecret || provided !== adminSecret) {
        return res.status(403).json({ error: 'Forbidden', message: 'Prime Freight: invalid admin secret' });
    }
    const { subject, expiresIn } = req.body || {};
    try {
        const token = issueToken({ sub: subject || 'client' }, { expiresIn });
        return res.status(201).json({ token, type: 'Token', expiresIn: expiresIn || '7d' });
    } catch (err) {
        console.error('Prime Freight token issuance error:', err);
        return res.status(500).json({ error: 'Internal Server Error', message: 'Token issuance failed' });
    }
});

// Routes (protected)
app.use('/api', apiKeyAuth, (await import('../routes/index.js')).default);

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


