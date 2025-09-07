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

interface PromoVideoFormData {
  title: string
  youtubeId: string
  description: string
  duration: string
  season: number
  week?: number
  isActive: boolean
}

interface PromoVideo extends PromoVideoFormData {
  id: string
  publishedAt: any
}

const PromoVideoManager: React.FC = () => {
  const [videos, setVideos] = useState<PromoVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [editingVideo, setEditingVideo] = useState<PromoVideo | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PromoVideoFormData>({
    defaultValues: {
      season: 9,
      isActive: true,
    },
  })

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      setLoading(true)
      const q = query(
        collection(db, 'promoVideos'),
        orderBy('publishedAt', 'desc')
      )
      const snapshot = await getDocs(q)
      
      const videosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PromoVideo[]
      
      setVideos(videosData)
    } catch (error) {
      console.error('Error loading promo videos:', error)
      showMessage('Error loading promo videos', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(null), 5000)
  }

  const extractYouTubeId = (url: string): string => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : url
  }

  const onSubmit = async (data: PromoVideoFormData) => {
    try {
      setSubmitting(true)

      // Extract YouTube ID from URL if full URL is provided
      const youtubeId = extractYouTubeId(data.youtubeId)

      const videoData = {
        ...data,
        youtubeId,
        thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
        publishedAt: serverTimestamp(),
      }

      if (editingVideo) {
        // Update existing video
        const videoRef = doc(db, 'promoVideos', editingVideo.id)
        await updateDoc(videoRef, {
          ...videoData,
          updatedAt: serverTimestamp(),
        })
        showMessage('Promo video updated successfully!', 'success')
        setEditingVideo(null)
      } else {
        // Create new video
        await addDoc(collection(db, 'promoVideos'), videoData)
        showMessage('Promo video added successfully!', 'success')
      }

      reset()
      await loadVideos()
    } catch (error) {
      console.error('Error saving promo video:', error)
      showMessage('Error saving promo video. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (video: PromoVideo) => {
    setEditingVideo(video)
    reset({
      title: video.title,
      youtubeId: video.youtubeId,
      description: video.description,
      duration: video.duration,
      season: video.season,
      week: video.week,
      isActive: video.isActive,
    })
  }

  const handleDelete = async (videoId: string) => {
    if (!window.confirm('Are you sure you want to delete this promo video?')) {
      return
    }

    try {
      await deleteDoc(doc(db, 'promoVideos', videoId))
      showMessage('Promo video deleted successfully', 'success')
      await loadVideos()
    } catch (error) {
      console.error('Error deleting promo video:', error)
      showMessage('Error deleting promo video', 'error')
    }
  }

  const cancelEdit = () => {
    setEditingVideo(null)
    reset({
      season: 9,
      isActive: true,
    })
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Promo Videos Management
      </Typography>

      {message && (
        <Alert severity={messageType} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {/* Add/Edit Video Form */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {editingVideo ? 'Edit Promo Video' : 'Add New Promo Video'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Video Title"
            {...register('title', { 
              required: 'Title is required',
              minLength: { value: 5, message: 'Title must be at least 5 characters' }
            })}
            error={!!errors.title}
            helperText={errors.title?.message}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="YouTube Video ID or URL"
            {...register('youtubeId', { 
              required: 'YouTube ID or URL is required'
            })}
            error={!!errors.youtubeId}
            helperText={errors.youtubeId?.message || "Enter YouTube video ID (e.g., dQw4w9WgXcQ) or full URL"}
            margin="normal"
            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          />
          
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            {...register('description')}
            helperText="Optional description for the video"
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Duration"
            {...register('duration')}
            helperText="Optional duration (e.g., 2:30, 1:45)"
            margin="normal"
            placeholder="2:30"
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
              label="Week Number (Optional)"
              type="number"
              {...register('week', { 
                min: { value: 1, message: 'Week must be at least 1' }
              })}
              error={!!errors.week}
              helperText={errors.week?.message}
              sx={{ flex: 1 }}
            />
          </Box>

          <FormControlLabel
            control={
              <Switch
                {...register('isActive')}
              />
            }
            label="Active"
            sx={{ mt: 2 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{ flex: 1 }}
            >
              {submitting ? <CircularProgress size={24} /> : (editingVideo ? 'Update Video' : 'Add Video')}
            </Button>
            
            {editingVideo && (
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

      {/* Videos List */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Existing Promo Videos
        </Typography>
        
        {loading ? (
          <CircularProgress />
        ) : videos.length === 0 ? (
          <Alert severity="info">No promo videos found</Alert>
        ) : (
          <Grid container spacing={2}>
            {videos.map((video) => (
              <Grid item xs={12} md={6} lg={4} key={video.id}>
                <Card>
                  <Box
                    component="img"
                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                    alt={video.title}
                    sx={{ width: '100%', height: 180, objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" component="div" sx={{ flex: 1 }}>
                        {video.title}
                      </Typography>
                      <Chip 
                        label={video.isActive ? 'Active' : 'Inactive'} 
                        color={video.isActive ? 'success' : 'default'} 
                        size="small" 
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Season {video.season}{video.week && ` • Week ${video.week}`}
                    </Typography>
                    {video.duration && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Duration: {video.duration}
                      </Typography>
                    )}
                    {video.description && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {video.description.length > 100 
                          ? `${video.description.substring(0, 100)}...` 
                          : video.description}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <IconButton onClick={() => handleEdit(video)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(video.id)} size="small" color="error">
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

export default PromoVideoManager
