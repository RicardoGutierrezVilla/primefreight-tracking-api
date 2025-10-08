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
		console.error('Error forwarding to Terminal49:', error);
		return res.status(502).json({ error: 'Bad Gateway', message: 'Failed to reach Terminal49' });
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
        console.error('Error fetching from Terminal49:', error);
        return res.status(502).json({ error: 'Bad Gateway', message: 'Failed to reach Terminal49' });
    }
});

// Get container
router.get('/containers/:containerId', (req, res) => {
	const { containerId } = req.params;
	res.status(200).json({ message: 'get container - placeholder', containerId });
});

// Get raw events
router.get('/containers/:containerId/raw-events', (req, res) => {
	const { containerId } = req.params;
	res.status(200).json({ message: 'get raw events - placeholder', containerId, events: [] });
});

// Get transport events
router.get('/containers/:containerId/transport-events', (req, res) => {
	const { containerId } = req.params;
	res.status(200).json({ message: 'get transport events - placeholder', containerId, events: [] });
});

export default router;


