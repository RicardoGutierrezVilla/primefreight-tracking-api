import { Router } from 'express';

const router = Router();

// Create tracking request
router.post('/tracking-requests', (req, res) => {
	const { body } = req;
	res.status(201).json({ message: 'create tracking request - placeholder', data: body || null });
});

// Get tracking request
router.get('/tracking-requests/:id', (req, res) => {
	const { id } = req.params;
	res.status(200).json({ message: 'get tracking request - placeholder', id });
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


