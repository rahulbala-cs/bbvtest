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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material'
import { Delete, Edit } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { formatDistanceToNow } from 'date-fns'
import { db } from '../services/firebase'

interface NewsFormData {
  title: string
  content: string
  type: 'elimination' | 'general' | 'voting' | 'announcement'
  imageUrl?: string
}

interface NewsItem {
  id: string
  title: string
  content: string
  type: 'elimination' | 'general' | 'voting' | 'announcement'
  imageUrl?: string
  timestamp: any
}

const NewsManager: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<NewsFormData>({
    defaultValues: {
      type: 'general',
    },
  })

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      setLoading(true)
      const q = query(collection(db, 'news'), orderBy('timestamp', 'desc'))
      const snapshot = await getDocs(q)
      
      const newsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NewsItem[]
      
      setNews(newsList)
    } catch (error) {
      console.error('Error loading news:', error)
      showMessage('Error loading news', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(null), 5000)
  }

  const onSubmit = async (data: NewsFormData) => {
    try {
      setSubmitting(true)

      if (editingNews) {
        // Update existing news
        const newsRef = doc(db, 'news', editingNews.id)
        await updateDoc(newsRef, {
          title: data.title,
          content: data.content,
          type: data.type,
          imageUrl: data.imageUrl || '',
          timestamp: serverTimestamp(),
        })
        showMessage('News updated successfully!', 'success')
      } else {
        // Create new news
        await addDoc(collection(db, 'news'), {
          title: data.title,
          content: data.content,
          type: data.type,
          imageUrl: data.imageUrl || '',
          timestamp: serverTimestamp(),
        })
        showMessage('News added successfully!', 'success')
      }

      reset()
      setEditingNews(null)
      await loadNews()
    } catch (error) {
      console.error('Error saving news:', error)
      showMessage('Error saving news. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (newsItem: NewsItem) => {
    setEditingNews(newsItem)
    setValue('title', newsItem.title)
    setValue('content', newsItem.content)
    setValue('type', newsItem.type)
    setValue('imageUrl', newsItem.imageUrl || '')
  }

  const handleDelete = async (newsItem: NewsItem) => {
    if (!window.confirm('Are you sure you want to delete this news item?')) return

    try {
      await deleteDoc(doc(db, 'news', newsItem.id))
      showMessage('News deleted successfully', 'success')
      await loadNews()
    } catch (error) {
      console.error('Error deleting news:', error)
      showMessage('Error deleting news', 'error')
    }
  }

  const handleCancel = () => {
    setEditingNews(null)
    reset()
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'elimination':
        return 'error'
      case 'voting':
        return 'primary'
      case 'announcement':
        return 'warning'
      default:
        return 'default'
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        News Management
      </Typography>

      {message && (
        <Alert severity={messageType} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {/* Add/Edit News Form */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {editingNews ? 'Edit News Item' : 'Add News Update'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="News Title"
            {...register('title', { 
              required: 'Title is required',
              minLength: { value: 10, message: 'Title must be at least 10 characters' }
            })}
            error={!!errors.title}
            helperText={errors.title?.message}
            margin="normal"
            placeholder="Breaking: Contestant X has been eliminated!"
          />
          
          <TextField
            fullWidth
            label="Content"
            {...register('content', { 
              required: 'Content is required',
              minLength: { value: 20, message: 'Content must be at least 20 characters' }
            })}
            error={!!errors.content}
            helperText={errors.content?.message}
            margin="normal"
            multiline
            rows={4}
            placeholder="Write the news content here..."
          />
          
          <TextField
            fullWidth
            label="Image URL (Optional)"
            {...register('imageUrl', { 
              pattern: {
                value: /^https?:\/\/.+/,
                message: 'Please enter a valid URL'
              }
            })}
            error={!!errors.imageUrl}
            helperText={errors.imageUrl?.message}
            margin="normal"
            placeholder="https://example.com/image.jpg"
          />
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>News Type</InputLabel>
            <Select
              {...register('type', { required: 'Type is required' })}
              error={!!errors.type}
              defaultValue="general"
            >
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="elimination">Elimination</MenuItem>
              <MenuItem value="voting">Voting</MenuItem>
              <MenuItem value="announcement">Announcement</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              size="large"
              fullWidth
            >
              {submitting ? <CircularProgress size={24} /> : editingNews ? 'Update News' : 'Publish News'}
            </Button>
            
            {editingNews && (
              <Button
                variant="outlined"
                onClick={handleCancel}
                size="large"
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* News List */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Published News ({news.length})
        </Typography>
        
        {loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ mt: 2 }}>
            {news.map((newsItem) => (
              <Card key={newsItem.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" sx={{ flex: 1, mr: 2 }}>
                      {newsItem.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={newsItem.type.toUpperCase()}
                        color={getTypeColor(newsItem.type) as any}
                        size="small"
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(newsItem)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(newsItem)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {newsItem.content}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {newsItem.timestamp && formatDistanceToNow(newsItem.timestamp.toDate(), { addSuffix: true })}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default NewsManager