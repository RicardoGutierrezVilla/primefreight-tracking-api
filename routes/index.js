import { Router } from 'express';

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
            return res.status(status).json(data);
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
            return res.status(status).json(data);
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
            return res.status(status).json(data);
        }

        const text = await upstreamResponse.text();
        return res.status(status).send(text);
    } catch (error) {
        console.error('Prime Freight proxy error (raw-events GET):', error);
        return res.status(502).json({ error: 'Bad Gateway', message: 'Prime Freight upstream request failed' });
    }
});

// Get transport events
router.get('/containers/:containerId/transport-events', (req, res) => {
	const { containerId } = req.params;
	res.status(200).json({ message: 'get transport events - placeholder', containerId, events: [] });
});

export default router;


