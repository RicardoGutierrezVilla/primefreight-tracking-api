import crypto from 'crypto';
import { verifyToken } from './jwt.js';

function safeEqual(a, b) {
    const aBuf = Buffer.from(a || '', 'utf8');
    const bBuf = Buffer.from(b || '', 'utf8');
    if (aBuf.length !== bBuf.length) {
        // Do timingSafeEqual with same-length buffer to avoid early return timing leak
        const dummyA = Buffer.alloc(Math.max(aBuf.length, bBuf.length), 0);
        const dummyB = Buffer.alloc(Math.max(aBuf.length, bBuf.length), 0);
        try { crypto.timingSafeEqual(dummyA, dummyB); } catch (_) {}
        return false;
    }
    try {
        return crypto.timingSafeEqual(aBuf, bBuf);
    } catch {
        return false;
    }
}

export function apiKeyAuth(req, res, next) {
    const rawKeys = process.env.API_KEYS || '';
    const allowedKeys = rawKeys
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    if (allowedKeys.length === 0) {
        // If not configured, deny by default
        return res.status(401).json({ error: 'Unauthorized', message: 'Prime Freight: API key not configured' });
    }

    const authHeader = req.headers.authorization || '';
    const tokenAuth = authHeader.startsWith('Token ')
        ? authHeader.substring('Token '.length).trim()
        : '';
    const headerKey = req.headers['x-api-key'] || req.headers['x-api-token'] || '';

    const presented = [String(tokenAuth || ''), String(headerKey || '')].filter(Boolean);

    let isAllowed = presented.some((candidate) =>
        allowedKeys.some((k) => safeEqual(candidate, k))
    );

    // If not matched by static keys, try JWT Token in Authorization: Token <jwt>
    if (!isAllowed && tokenAuth) {
        try {
            verifyToken(tokenAuth);
            isAllowed = true;
        } catch (_) {
            isAllowed = false;
        }
    }

    if (!isAllowed) {
        return res.status(403).json({ error: 'Forbidden', message: 'Prime Freight: invalid API token' });
    }

    return next();
}


