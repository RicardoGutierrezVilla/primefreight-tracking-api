import { verifyToken } from './jwt.js';

export function apiKeyAuth(req, res, next) {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Missing Bearer token' });
    }

    const token = authHeader.substring('Bearer '.length).trim();
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Missing Bearer token' });
    }

    try {
        verifyToken(token);
        return next();
    } catch (err) {
        console.error('Prime Freight auth error:', err?.message || err);
        return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' });
    }
}

