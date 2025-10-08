import { Router } from 'express';

function sanitizeUpstreamPayload(input) {
    const blockedKeys = new Set(['links', '_links', 'self', 'href']);
    const blockedSubstr = ['terminal49.com', 'terminal49'];

    function shouldRedactValue(value) {
        if (typeof value !== 'string') return false;
        const lower = value.toLowerCase();
        return blockedSubstr.some((s) => lower.includes(s));
    }

    function sanitize(value) {
        if (value === null || value === undefined) return value;
        if (Array.isArray(value)) return value.map(sanitize);
        if (typeof value === 'object') {
            const result = {};
            for (const [key, v] of Object.entries(value)) {
                if (blockedKeys.has(key)) continue;
                if (shouldRedactValue(v)) continue;
                result[key] = sanitize(v);
            }
            return result;
        }
        if (shouldRedactValue(value)) return undefined;
        return value;
    }

    return sanitize(input);
}

const router = Router();

// Create tracking request - forwards to Terminal49 API
router.post('/tracking-requests', async (req, res) => {
	try {
		const upstreamResponse = await fetch('https://api.terminal49.com/v2/tracking_requests', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Token ${process.env.TERMINAL49_TOKEN || '2ZHS6xHrBpHKTP7RSPMWR5T8'}`,
			},
			body: JSON.stringify(req.body ?? {}),
		});

		const contentType = upstreamResponse.headers.get('content-type') || '';
		const status = upstreamResponse.status;

		if (contentType.includes('application/json')) {
			const data = await upstreamResponse.json();
			return res.status(status).json(data);
		}

		const text = await upstreamResponse.text();
		return res.status(status).send(text);
	} catch (error) {
		console.error('Prime Freight proxy error (tracking-requests POST):', error);
		return res.status(502).json({ error: 'Bad Gateway', message: 'Prime Freight upstream request failed' });
	}
});

// Get tracking request - forwards to Terminal49 API
router.get('/tracking-requests/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const upstreamResponse = await fetch(`https://api.terminal49.com/v2/tracking_requests/${encodeURIComponent(id)}`, {
            method: 'GET',
            headers: {
                Authorization: `Token ${process.env.TERMINAL49_TOKEN || '2ZHS6xHrBpHKTP7RSPMWR5T8'}`,
            },
        });

        const contentType = upstreamResponse.headers.get('content-type') || '';
        const status = upstreamResponse.status;

        if (contentType.includes('application/json')) {
            const data = await upstreamResponse.json();
            const sanitized = sanitizeUpstreamPayload(data);
            return res.status(status).json(sanitized);
        }

        const text = await upstreamResponse.text();
        return res.status(status).send(text);
    } catch (error) {
        console.error('Prime Freight proxy error (tracking-requests GET):', error);
        return res.status(502).json({ error: 'Bad Gateway', message: 'Prime Freight upstream request failed' });
    }
});

// Get container - forwards to Terminal49 API
router.get('/containers/:containerId', async (req, res) => {
    const { containerId } = req.params;
    try {
        const upstreamResponse = await fetch(`https://api.terminal49.com/v2/containers/${encodeURIComponent(containerId)}`, {
            method: 'GET',
            headers: {
                Authorization: `Token ${process.env.TERMINAL49_TOKEN || '2ZHS6xHrBpHKTP7RSPMWR5T8'}`,
            },
        });

        const contentType = upstreamResponse.headers.get('content-type') || '';
        const status = upstreamResponse.status;

        if (contentType.includes('application/json')) {
            const data = await upstreamResponse.json();
            const sanitized = sanitizeUpstreamPayload(data);
            return res.status(status).json(sanitized);
        }

        const text = await upstreamResponse.text();
        return res.status(status).send(text);
    } catch (error) {
        console.error('Prime Freight proxy error (containers GET):', error);
        return res.status(502).json({ error: 'Bad Gateway', message: 'Prime Freight upstream request failed' });
    }
});

// Get raw events - forwards to Terminal49 API
router.get('/containers/:containerId/raw-events', async (req, res) => {
    const { containerId } = req.params;
    try {
        const upstreamResponse = await fetch(`https://api.terminal49.com/v2/containers/${encodeURIComponent(containerId)}/raw_events`, {
            method: 'GET',
            headers: {
                Authorization: `Token ${process.env.TERMINAL49_TOKEN || '2ZHS6xHrBpHKTP7RSPMWR5T8'}`,
            },
        });

        const contentType = upstreamResponse.headers.get('content-type') || '';
        const status = upstreamResponse.status;

        if (contentType.includes('application/json')) {
            const data = await upstreamResponse.json();
            const sanitized = sanitizeUpstreamPayload(data);
            return res.status(status).json(sanitized);
        }

        const text = await upstreamResponse.text();
        return res.status(status).send(text);
    } catch (error) {
        console.error('Prime Freight proxy error (raw-events GET):', error);
        return res.status(502).json({ error: 'Bad Gateway', message: 'Prime Freight upstream request failed' });
    }
});

// Get transport events - forwards to Terminal49 API
router.get('/containers/:containerId/transport-events', async (req, res) => {
    const { containerId } = req.params;
    try {
        const upstreamResponse = await fetch(`https://api.terminal49.com/v2/containers/${encodeURIComponent(containerId)}/transport_events`, {
            method: 'GET',
            headers: {
                Authorization: `Token ${process.env.TERMINAL49_TOKEN || '2ZHS6xHrBpHKTP7RSPMWR5T8'}`,
            },
        });

        const contentType = upstreamResponse.headers.get('content-type') || '';
        const status = upstreamResponse.status;

        if (contentType.includes('application/json')) {
            const data = await upstreamResponse.json();
            const sanitized = sanitizeUpstreamPayload(data);
            return res.status(status).json(sanitized);
        }

        const text = await upstreamResponse.text();
        return res.status(status).send(text);
    } catch (error) {
        console.error('Prime Freight proxy error (transport-events GET):', error);
        return res.status(502).json({ error: 'Bad Gateway', message: 'Prime Freight upstream request failed' });
    }
});

export default router;


