# Notifications API configuration

Create a `.env.local` file in this directory and set:

```
VITE_NOTIFICATIONS_API=https://<your-region>-<project-id>.cloudfunctions.net/sendNotification
```

During local development with an emulator or a local server, you can set
`VITE_NOTIFICATIONS_API=http://localhost:5001/<project-id>/us-central1/sendNotification`


