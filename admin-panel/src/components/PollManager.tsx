import React, { useState, useEffect } from 'react'
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../services/firebase'

interface PollFormData {
  title: string
  embedUrl: string
  pollId: string
  week: number
  season: number
}

interface Poll {
  id: string
  title: string
  embedUrl: string
  pollId?: string
  isActive: boolean
  week: number
  season: number
  createdAt: any
  updatedAt: any
}

const PollManager: React.FC = () => {
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PollFormData>({
    defaultValues: {
      season: 9, // Current season
      week: 1,
    },
  })

  useEffect(() => {
    loadCurrentPoll()
  }, [])

  const loadCurrentPoll = async () => {
    try {
      setLoading(true)
      const q = query(collection(db, 'polls'), where('isActive', '==', true))
      const snapshot = await getDocs(q)
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0]
        setCurrentPoll({ id: doc.id, ...doc.data() } as Poll)
      }
    } catch (error) {
      console.error('Error loading current poll:', error)
      showMessage('Error loading current poll', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(null), 5000)
  }

  const deactivateCurrentPoll = async () => {
    if (!currentPoll) return

    try {
      const pollRef = doc(db, 'polls', currentPoll.id)
      await updateDoc(pollRef, {
        isActive: false,
        updatedAt: serverTimestamp(),
      })
      setCurrentPoll(null)
    } catch (error) {
      console.error('Error deactivating current poll:', error)
      throw error
    }
  }

  const onSubmit = async (data: PollFormData) => {
    try {
      setSubmitting(true)

      // Deactivate current poll if exists
      if (currentPoll) {
        await deactivateCurrentPoll()
      }

      // Create new poll
      const newPollRef = await addDoc(collection(db, 'polls'), {
        title: data.title,
        embedUrl: data.embedUrl,
        pollId: data.pollId,
        week: data.week,
        season: data.season,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      showMessage('Poll activated successfully!', 'success')
      reset()
      
      // Reload current poll
      await loadCurrentPoll()
    } catch (error) {
      console.error('Error creating poll:', error)
      showMessage('Error activating poll. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Poll Management
      </Typography>

      {message && (
        <Alert severity={messageType} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {/* Current Poll Display */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Current Active Poll
        </Typography>
        
        {loading ? (
          <CircularProgress size={24} />
        ) : currentPoll ? (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6">{currentPoll.title}</Typography>
                <Chip label="ACTIVE" color="primary" size="small" />
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Week {currentPoll.week} • Season {currentPoll.season}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Poll URL: {currentPoll.embedUrl}
              </Typography>
              {currentPoll.pollId && (
                <Typography variant="body2" color="text.secondary">
                  Poll ID: {currentPoll.pollId}
                </Typography>
              )}
              <Button
                variant="outlined"
                color="error"
                sx={{ mt: 2 }}
                onClick={async () => {
                  if (window.confirm('Are you sure you want to deactivate this poll?')) {
                    await deactivateCurrentPoll()
                    showMessage('Poll deactivated successfully', 'success')
                  }
                }}
              >
                Deactivate Poll
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Alert severity="info">No active poll found</Alert>
        )}
      </Paper>

      {/* Create New Poll Form */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Create New Poll
        </Typography>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>JavaScript Embed Format:</strong>
          </Typography>
          <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
{`<script type="text/javascript" charset="utf-8" src="https://secure.polldaddy.com/p/10967724.js"></script>
<noscript><a href="https://poll.fm/10967724">Bigg Boss Telugu 8 Voting</a></noscript>`}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            From the embed code above, use <strong>10967724</strong> as the Poll ID and <strong>https://poll.fm/10967724</strong> as the fallback URL.
          </Typography>
        </Alert>
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Poll Title"
            {...register('title', { 
              required: 'Title is required',
              minLength: { value: 10, message: 'Title must be at least 10 characters' }
            })}
            error={!!errors.title}
            helperText={errors.title?.message}
            margin="normal"
            placeholder="Week 5: Who Should Be Eliminated? Vote Now!"
          />
          
          <TextField
            fullWidth
            label="Poll ID (for JavaScript embed)"
            {...register('pollId', { 
              required: 'Poll ID is required',
              pattern: {
                value: /^\d+$/,
                message: 'Poll ID should only contain numbers'
              }
            })}
            error={!!errors.pollId}
            helperText={errors.pollId?.message || "Enter the poll ID from the JavaScript embed (e.g., 10967724)"}
            margin="normal"
            placeholder="10967724"
          />
          
          <TextField
            fullWidth
            label="Fallback Poll URL"
            {...register('embedUrl', { 
              required: 'Embed URL is required',
              pattern: {
                value: /^https?:\/\/.+/,
                message: 'Please enter a valid URL'
              }
            })}
            error={!!errors.embedUrl}
            helperText={errors.embedUrl?.message || "Fallback URL for browsers without JavaScript support"}
            margin="normal"
            placeholder="https://poll.fm/10967724"
          />
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              label="Week Number"
              type="number"
              {...register('week', { 
                required: 'Week is required',
                min: { value: 1, message: 'Week must be at least 1' }
              })}
              error={!!errors.week}
              helperText={errors.week?.message}
              sx={{ flex: 1 }}
            />
            
            <TextField
              label="Season Number"
              type="number"
              {...register('season', { 
                required: 'Season is required',
                min: { value: 1, message: 'Season must be at least 1' }
              })}
              error={!!errors.season}
              helperText={errors.season?.message}
              sx={{ flex: 1 }}
            />
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{ mt: 3 }}
            size="large"
            fullWidth
          >
            {submitting ? <CircularProgress size={24} /> : 'Activate New Poll'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default PollManager