const express = require('express');
const cors = require('cors');

const app = express();

// Enhanced CORS configuration
app.use(cors({
	origin: [
		'http://localhost:3000',
		'http://localhost:3001',
		'http://localhost:4173',
		'http://localhost:4174',
		'http://127.0.0.1:3000',
		'http://127.0.0.1:3001',
		'http://127.0.0.1:4173',
		'http://127.0.0.1:4174',
	],
	methods: ['GET', 'POST', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
	credentials: true
}));

app.use(express.json());

app.post('/api/send-notification', async (req, res) => {
	try {
		const { title, message, type } = req.body;
		
		console.log('Received notification request:', { title, message, type });
		
		if (!title || !message) {
			return res.status(400).json({ error: 'Missing title or message' });
		}

		// For testing - just log the notification instead of sending via FCM
		console.log('📱 NOTIFICATION WOULD BE SENT:');
		console.log(`Title: ${title}`);
		console.log(`Message: ${message}`);
		console.log(`Type: ${type || 'general'}`);
		console.log('---');
		
		res.json({ 
			success: true, 
			messageId: 'test-' + Date.now(),
			message: 'Notification logged successfully (test mode)'
		});
		
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ 
			success: false, 
			error: error.message 
		});
	}
});

// Health check endpoint
app.get('/health', (req, res) => {
	res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
	console.log(`🚀 Test notification server running on port ${PORT}`);
	console.log(`📡 Send notifications to: http://localhost:${PORT}/api/send-notification`);
	console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});
