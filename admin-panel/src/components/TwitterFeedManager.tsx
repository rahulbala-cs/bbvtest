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
  CardActions,
  Grid,
  Chip,
  Switch,
  FormControlLabel,
  IconButton,
} from '@mui/material'
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore'
import { db } from '../services/firebase'

interface TwitterFeedFormData {
  hashtag: string
  season: number
  displayCount: number
  isActive: boolean
}

interface TwitterFeed extends TwitterFeedFormData {
  id: string
  createdAt: any
}

const TwitterFeedManager: React.FC = () => {
  const [feeds, setFeeds] = useState<TwitterFeed[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [editingFeed, setEditingFeed] = useState<TwitterFeed | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TwitterFeedFormData>({
    defaultValues: {
      season: 9,
      displayCount: 10,
      isActive: true,
    },
  })

  useEffect(() => {
    loadTwitterFeeds()
  }, [])

  const loadTwitterFeeds = async () => {
    try {
      setLoading(true)
      const q = query(
        collection(db, 'twitterFeeds'),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      
      const feedsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TwitterFeed[]
      
      setFeeds(feedsData)
    } catch (error) {
      console.error('Error loading Twitter feeds:', error)
      showMessage('Error loading Twitter feeds', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(null), 5000)
  }

  const formatHashtag = (hashtag: string): string => {
    // Remove # if present, then add it back
    const cleanHashtag = hashtag.replace(/^#/, '')
    return `#${cleanHashtag}`
  }

  const onSubmit = async (data: TwitterFeedFormData) => {
    try {
      setSubmitting(false)

      // Deactivate other feeds for the same season if this one is active
      if (data.isActive) {
        const activeFeeds = feeds.filter(feed => 
          feed.season === data.season && 
          feed.isActive && 
          feed.id !== editingFeed?.id
        )
        
        for (const feed of activeFeeds) {
          await updateDoc(doc(db, 'twitterFeeds', feed.id), {
            isActive: false,
            updatedAt: serverTimestamp(),
          })
        }
      }

      const feedData = {
        ...data,
        hashtag: formatHashtag(data.hashtag),
      }

      if (editingFeed) {
        // Update existing feed
        const feedRef = doc(db, 'twitterFeeds', editingFeed.id)
        await updateDoc(feedRef, {
          ...feedData,
          updatedAt: serverTimestamp(),
        })
        showMessage('Twitter feed updated successfully!', 'success')
        setEditingFeed(null)
      } else {
        // Create new feed
        await addDoc(collection(db, 'twitterFeeds'), {
          ...feedData,
          createdAt: serverTimestamp(),
        })
        showMessage('Twitter feed added successfully!', 'success')
      }

      reset()
      await loadTwitterFeeds()
    } catch (error) {
      console.error('Error saving Twitter feed:', error)
      showMessage('Error saving Twitter feed. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (feed: TwitterFeed) => {
    setEditingFeed(feed)
    reset({
      hashtag: feed.hashtag,
      season: feed.season,
      displayCount: feed.displayCount,
      isActive: feed.isActive,
    })
  }

  const handleDelete = async (feedId: string) => {
    if (!window.confirm('Are you sure you want to delete this Twitter feed?')) {
      return
    }

    try {
      await deleteDoc(doc(db, 'twitterFeeds', feedId))
      showMessage('Twitter feed deleted successfully', 'success')
      await loadTwitterFeeds()
    } catch (error) {
      console.error('Error deleting Twitter feed:', error)
      showMessage('Error deleting Twitter feed', 'error')
    }
  }

  const cancelEdit = () => {
    setEditingFeed(null)
    reset({
      season: 9,
      displayCount: 10,
      isActive: true,
    })
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Twitter Feed Management
      </Typography>

      {message && (
        <Alert severity={messageType} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Twitter feeds allow you to display live tweets for a specific hashtag in the app's Updates section.
          Only one feed can be active per season.
        </Typography>
      </Alert>

      {/* Add/Edit Feed Form */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {editingFeed ? 'Edit Twitter Feed' : 'Add New Twitter Feed'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Hashtag"
            {...register('hashtag', { 
              required: 'Hashtag is required',
              pattern: {
                value: /^#?\w+$/,
                message: 'Hashtag should contain only letters, numbers, and underscores'
              }
            })}
            error={!!errors.hashtag}
            helperText={errors.hashtag?.message || "Enter hashtag with or without # (e.g., biggbosstelugu or #biggbosstelugu)"}
            margin="normal"
            placeholder="#biggbosstelugu"
          />
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
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
            
            <TextField
              label="Display Count"
              type="number"
              {...register('displayCount', { 
                required: 'Display count is required',
                min: { value: 1, message: 'Display count must be at least 1' },
                max: { value: 20, message: 'Display count cannot exceed 20' }
              })}
              error={!!errors.displayCount}
              helperText={errors.displayCount?.message || "Number of tweets to display (1-20)"}
              sx={{ flex: 1 }}
            />
          </Box>

          <FormControlLabel
            control={
              <Switch
                {...register('isActive')}
              />
            }
            label="Active (will deactivate other feeds for this season)"
            sx={{ mt: 2 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{ flex: 1 }}
            >
              {submitting ? <CircularProgress size={24} /> : (editingFeed ? 'Update Feed' : 'Add Feed')}
            </Button>
            
            {editingFeed && (
              <Button
                variant="outlined"
                onClick={cancelEdit}
                sx={{ flex: 1 }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Feeds List */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Existing Twitter Feeds
        </Typography>
        
        {loading ? (
          <CircularProgress />
        ) : feeds.length === 0 ? (
          <Alert severity="info">No Twitter feeds found</Alert>
        ) : (
          <Grid container spacing={2}>
            {feeds.map((feed) => (
              <Grid item xs={12} md={6} lg={4} key={feed.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="div" sx={{ flex: 1 }}>
                        {feed.hashtag}
                      </Typography>
                      <Chip 
                        label={feed.isActive ? 'Active' : 'Inactive'} 
                        color={feed.isActive ? 'success' : 'default'} 
                        size="small" 
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Season {feed.season}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Display Count: {feed.displayCount} tweets
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton onClick={() => handleEdit(feed)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(feed.id)} size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  )
}

export default TwitterFeedManager
