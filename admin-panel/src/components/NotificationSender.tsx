import React, { useState } from 'react'
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material'
import { useForm } from 'react-hook-form'

interface NotificationFormData {
  title: string
  message: string
  type: 'voting' | 'elimination' | 'announcement' | 'general'
}

const NotificationSender: React.FC = () => {
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NotificationFormData>({
    defaultValues: {
      type: 'general',
    },
  })

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(null), 5000)
  }

  const onSubmit = async (data: NotificationFormData) => {
    try {
      setSubmitting(true)

      // Backend API to Cloud Function or local emulator
      const API_URL = import.meta.env.VITE_NOTIFICATIONS_API || '/api/send-notification'
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          message: data.message,
          type: data.type,
        }),
      })

      if (response.ok) {
        showMessage('Notification sent successfully to all users!', 'success')
        reset()
      } else {
        throw new Error('Failed to send notification')
      }
    } catch (error) {
      console.error('Error sending notification:', error)
      showMessage('Error sending notification. Please check API config and try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const presetMessages = [
    {
      title: 'Voting is Open!',
      message: 'Cast your vote now for this week\'s elimination! 🗳️',
      type: 'voting',
    },
    {
      title: 'Last Chance to Vote!',
      message: 'Voting ends in 1 hour. Don\'t miss your chance to save your favorite contestant! ⏰',
      type: 'voting',
    },
    {
      title: 'Elimination Alert',
      message: 'Someone has been eliminated! Check the app for the latest updates. 😢',
      type: 'elimination',
    },
    {
      title: 'New Episode Tonight',
      message: 'Don\'t miss tonight\'s episode of Bigg Boss Telugu! Tune in at 10 PM. 📺',
      type: 'announcement',
    },
  ]

  const usePreset = (preset: typeof presetMessages[0]) => {
    reset({
      title: preset.title,
      message: preset.message,
      type: preset.type as any,
    })
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Push Notifications
      </Typography>

      {message && (
        <Alert severity={messageType} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {/* Preset Messages */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Message Templates
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Click on any template to use it as a starting point
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
          {presetMessages.map((preset, index) => (
            <Card
              key={index}
              sx={{
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' },
              }}
              onClick={() => usePreset(preset)}
            >
              <CardContent sx={{ py: 1.5 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {preset.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {preset.message}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>

      {/* Send Notification Form */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Send Custom Notification
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Notification Title"
            {...register('title', { 
              required: 'Title is required',
              maxLength: { value: 50, message: 'Title must be under 50 characters' }
            })}
            error={!!errors.title}
            helperText={errors.title?.message || 'Keep it short and catchy'}
            margin="normal"
            placeholder="Voting is Open!"
          />
          
          <TextField
            fullWidth
            label="Message"
            {...register('message', { 
              required: 'Message is required',
              maxLength: { value: 200, message: 'Message must be under 200 characters' }
            })}
            error={!!errors.message}
            helperText={errors.message?.message || 'Clear and concise message to users'}
            margin="normal"
            multiline
            rows={3}
            placeholder="Cast your vote now for this week's elimination!"
          />
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Notification Type</InputLabel>
            <Select
              {...register('type', { required: 'Type is required' })}
              error={!!errors.type}
              defaultValue="general"
            >
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="voting">Voting</MenuItem>
              <MenuItem value="elimination">Elimination</MenuItem>
              <MenuItem value="announcement">Announcement</MenuItem>
            </Select>
          </FormControl>
          
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Important:</strong> This notification will be sent to ALL app users immediately. 
              Please double-check your message before sending.
            </Typography>
          </Alert>
          
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            size="large"
            fullWidth
            sx={{ mt: 3 }}
            color="primary"
          >
            {submitting ? (
              <CircularProgress size={24} />
            ) : (
              'Send to All Users'
            )}
          </Button>
        </Box>
      </Paper>

      {/* Instructions */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          How to Use Push Notifications Effectively
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <li>
            <Typography variant="body2">
              <strong>Voting notifications:</strong> Send when voting opens, remind users when it's about to close
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Elimination alerts:</strong> Notify immediately after eliminations are announced
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Timing:</strong> Best times are 7-9 PM when users are most active
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Frequency:</strong> Don't exceed 2-3 notifications per day to avoid annoying users
            </Typography>
          </li>
        </Box>
      </Paper>
    </Box>
  )
}

export default NotificationSender