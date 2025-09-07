import React, { useState, useEffect } from 'react'
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
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
} from 'firebase/firestore'
import { db } from '../services/firebase'

interface ContestantFormData {
  name: string
  imageUrl: string
  status: 'active' | 'eliminated'
  season: number
  description?: string
}

interface Contestant {
  id: string
  name: string
  imageUrl: string
  status: 'active' | 'eliminated'
  season: number
  description?: string
}

const ContestantManager: React.FC = () => {
  const [contestants, setContestants] = useState<Contestant[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [editingContestant, setEditingContestant] = useState<Contestant | null>(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ContestantFormData>({
    defaultValues: {
      season: 8,
      status: 'active',
    },
  })

  useEffect(() => {
    loadContestants()
  }, [])

  const loadContestants = async () => {
    try {
      setLoading(true)
      const q = query(collection(db, 'contestants'), orderBy('name'))
      const snapshot = await getDocs(q)
      
      const contestantsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Contestant[]
      
      setContestants(contestantsList)
    } catch (error) {
      console.error('Error loading contestants:', error)
      showMessage('Error loading contestants', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(null), 5000)
  }

  const onSubmit = async (data: ContestantFormData) => {
    try {
      setSubmitting(true)

      if (editingContestant) {
        // Update existing contestant
        const contestantRef = doc(db, 'contestants', editingContestant.id)
        await updateDoc(contestantRef, {
          name: data.name,
          imageUrl: data.imageUrl,
          status: data.status,
          season: data.season,
          description: data.description,
        })
        showMessage('Contestant updated successfully!', 'success')
      } else {
        // Create new contestant
        await addDoc(collection(db, 'contestants'), {
          name: data.name,
          imageUrl: data.imageUrl,
          status: data.status,
          season: data.season,
          description: data.description || '',
        })
        showMessage('Contestant added successfully!', 'success')
      }

      reset()
      setEditingContestant(null)
      await loadContestants()
    } catch (error) {
      console.error('Error saving contestant:', error)
      showMessage('Error saving contestant. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (contestant: Contestant) => {
    setEditingContestant(contestant)
    setValue('name', contestant.name)
    setValue('imageUrl', contestant.imageUrl)
    setValue('status', contestant.status)
    setValue('season', contestant.season)
    setValue('description', contestant.description || '')
  }

  const handleDelete = async (contestant: Contestant) => {
    if (!window.confirm(`Are you sure you want to delete ${contestant.name}?`)) return

    try {
      await deleteDoc(doc(db, 'contestants', contestant.id))
      showMessage('Contestant deleted successfully', 'success')
      await loadContestants()
    } catch (error) {
      console.error('Error deleting contestant:', error)
      showMessage('Error deleting contestant', 'error')
    }
  }

  const handleCancel = () => {
    setEditingContestant(null)
    reset()
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Contestant Management
      </Typography>

      {message && (
        <Alert severity={messageType} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {/* Add/Edit Contestant Form */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {editingContestant ? 'Edit Contestant' : 'Add New Contestant'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Contestant Name"
            {...register('name', { 
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' }
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Image URL"
            {...register('imageUrl', { 
              required: 'Image URL is required',
              pattern: {
                value: /^https?:\/\/.+/,
                message: 'Please enter a valid URL'
              }
            })}
            error={!!errors.imageUrl}
            helperText={errors.imageUrl?.message}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Description (Optional)"
            {...register('description')}
            margin="normal"
            multiline
            rows={2}
            placeholder="Brief description about the contestant..."
          />
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Status</InputLabel>
              <Select
                {...register('status', { required: 'Status is required' })}
                error={!!errors.status}
                defaultValue="active"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="eliminated">Eliminated</MenuItem>
              </Select>
            </FormControl>
            
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
          
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              size="large"
              fullWidth
            >
              {submitting ? <CircularProgress size={24} /> : editingContestant ? 'Update Contestant' : 'Add Contestant'}
            </Button>
            
            {editingContestant && (
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

      {/* Contestants List */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          All Contestants ({contestants.length})
        </Typography>
        
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {contestants.map((contestant) => (
              <Grid item xs={12} sm={6} md={4} key={contestant.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={contestant.imageUrl}
                    alt={contestant.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image'
                    }}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6">{contestant.name}</Typography>
                      <Chip
                        label={contestant.status.toUpperCase()}
                        color={contestant.status === 'active' ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Season {contestant.season}
                    </Typography>
                    {contestant.description && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {contestant.description}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleEdit(contestant)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(contestant)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  )
}

export default ContestantManager