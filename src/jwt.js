import jwt from 'jsonwebtoken';

const DEFAULT_EXP = '7d';

export function issueToken(payload = {}, options = {}) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');
    const expiresIn = options.expiresIn || DEFAULT_EXP;
    return jwt.sign(payload, secret, { expiresIn, audience: 'primefreight', issuer: 'primefreight-api' });
}

export function verifyToken(token) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');
    return jwt.verify(token, secret, { audience: 'primefreight', issuer: 'primefreight-api' });
}


