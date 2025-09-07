const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');

const app = express();

// Enhanced CORS for local dev
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
  credentials: true,
}));

app.use(express.json());

// Initialize Firebase Admin (supports ADC, file path, or base64 env)
try {
  let options = {};
  if (process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
    const json = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, 'base64').toString('utf8'));
    options = { credential: cert(json), projectId: json.project_id };
    console.log('Using FIREBASE_SERVICE_ACCOUNT_B64 for admin credentials');
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
    const json = JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8'));
    options = { credential: cert(json), projectId: json.project_id };
    console.log('Using GOOGLE_APPLICATION_CREDENTIALS file for admin credentials');
  } else {
    const envProjectId = process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;
    if (envProjectId) {
      options = { projectId: envProjectId };
      console.log('Using ADC with explicit projectId:', envProjectId);
    } else {
      console.log('No explicit credentials provided, attempting Application Default Credentials');
    }
  }
  initializeApp(options);
} catch (e) {
  console.log('Firebase init error:', e.message);
}

app.post('/api/send-notification', async (req, res) => {
  try {
    const { title, message, type } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ error: 'Missing title or message' });
    }

    const messaging = getMessaging();
    
    const msg = {
      topic: 'all-users',
      notification: {
        title,
        body: message,
      },
      data: {
        type: String(type || 'general'),
      },
    };

    const response = await messaging.send(msg);
    console.log('Successfully sent message:', response);
    
    res.json({ 
      success: true, 
      messageId: response,
      message: 'Notification sent successfully'
    });
    
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Send to a specific device token (useful for testing)
app.post('/api/send-notification-to-token', async (req, res) => {
  try {
    const { token, title, message, type } = req.body;
    if (!token || !title || !message) {
      return res.status(400).json({ error: 'Missing token, title or message' });
    }

    const messaging = getMessaging();
    const msg = {
      token,
      notification: { title, body: message },
      data: { type: String(type || 'general') },
    };

    const response = await messaging.send(msg);
    console.log('Successfully sent message to token:', response);
    res.json({ success: true, messageId: response, message: 'Notification sent successfully to token' });
  } catch (error) {
    console.error('Error sending to token:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Notification server running on port ${PORT}`);
  console.log(`Send notifications to: http://localhost:${PORT}/api/send-notification`);
});
