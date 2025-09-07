// Minimal Firebase Cloud Function to broadcast to all-users topic
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

try { admin.initializeApp() } catch (_) {}

export const sendNotification = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed')
    return
  }

  const { title, message, type } = req.body || {}
  if (!title || !message) {
    res.status(400).json({ error: 'Missing title or message' })
    return
  }

  const msg: admin.messaging.Message = {
    topic: 'all-users',
    notification: {
      title,
      body: message,
    },
    data: {
      type: String(type || 'general'),
    },
  }

  try {
    const id = await admin.messaging().send(msg)
    res.json({ ok: true, messageId: id })
  } catch (err) {
    console.error('FCM send error', err)
    res.status(500).json({ ok: false, error: String(err) })
  }
})


