import React, { useState, useEffect } from 'react'
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../services/firebase'

interface AppConfigFormData {
  currentSeason: number
  adMobBannerId: string
  adMobInterstitialId: string
  adFrequencyCapMinutes: number
  appName: string
  appVersion: string
  maintenanceMode: boolean
  maintenanceMessage: string
}

interface AppConfig extends AppConfigFormData {
  id: string
}

const AppConfigManager: React.FC = () => {
  const [currentConfig, setCurrentConfig] = useState<AppConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<AppConfigFormData>({
    defaultValues: {
      currentSeason: 9,
      adFrequencyCapMinutes: 60,
      appName: 'Bigg Boss Telugu Vote',
      appVersion: '1.0.0',
      maintenanceMode: false,
      maintenanceMessage: '',
    },
  })

  const maintenanceMode = watch('maintenanceMode')

  useEffect(() => {
    loadCurrentConfig()
  }, [])

  const loadCurrentConfig = async () => {
    try {
      setLoading(true)
      const configRef = doc(db, 'config', 'app')
      const configDoc = await getDoc(configRef)
      
      if (configDoc.exists()) {
        const data = configDoc.data() as AppConfigFormData
        setCurrentConfig({ id: configDoc.id, ...data })
        reset(data)
      }
    } catch (error) {
      console.error('Error loading app config:', error)
      showMessage('Error loading app configuration', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(null), 5000)
  }

  const onSubmit = async (data: AppConfigFormData) => {
    try {
      setSubmitting(true)

      const configRef = doc(db, 'config', 'app')
      await setDoc(configRef, {
        ...data,
        updatedAt: serverTimestamp(),
      }, { merge: true })

      showMessage('App configuration updated successfully!', 'success')
      await loadCurrentConfig()
    } catch (error) {
      console.error('Error updating app config:', error)
      showMessage('Error updating configuration. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        App Configuration
      </Typography>

      {message && (
        <Alert severity={messageType} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Application Settings
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Current Season"
                type="number"
                {...register('currentSeason', { 
                  required: 'Current season is required',
                  min: { value: 1, message: 'Season must be at least 1' }
                })}
                error={!!errors.currentSeason}
                helperText={errors.currentSeason?.message}
                sx={{ flex: 1 }}
              />
              
              <TextField
                label="App Version"
                {...register('appVersion', { 
                  required: 'App version is required'
                })}
                error={!!errors.appVersion}
                helperText={errors.appVersion?.message}
                sx={{ flex: 1 }}
              />
            </Box>

            <TextField
              fullWidth
              label="App Name"
              {...register('appName', { 
                required: 'App name is required'
              })}
              error={!!errors.appName}
              helperText={errors.appName?.message}
              margin="normal"
            />

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              AdMob Configuration
            </Typography>

            <TextField
              fullWidth
              label="Banner Ad ID"
              {...register('adMobBannerId')}
              helperText="AdMob Banner Ad Unit ID"
              margin="normal"
            />

            <TextField
              fullWidth
              label="Interstitial Ad ID"
              {...register('adMobInterstitialId')}
              helperText="AdMob Interstitial Ad Unit ID"
              margin="normal"
            />

            <TextField
              fullWidth
              label="Ad Frequency Cap (minutes)"
              type="number"
              {...register('adFrequencyCapMinutes', { 
                required: 'Ad frequency cap is required',
                min: { value: 1, message: 'Must be at least 1 minute' }
              })}
              error={!!errors.adFrequencyCapMinutes}
              helperText={errors.adFrequencyCapMinutes?.message || "Minimum time between interstitial ads"}
              margin="normal"
            />

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Maintenance Mode
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  {...register('maintenanceMode')}
                />
              }
              label="Enable Maintenance Mode"
            />

            {maintenanceMode && (
              <TextField
                fullWidth
                label="Maintenance Message"
                multiline
                rows={3}
                {...register('maintenanceMessage', { 
                  required: maintenanceMode ? 'Maintenance message is required when maintenance mode is enabled' : false
                })}
                error={!!errors.maintenanceMessage}
                helperText={errors.maintenanceMessage?.message || "Message to show users during maintenance"}
                margin="normal"
              />
            )}
            
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{ mt: 3 }}
              size="large"
              fullWidth
            >
              {submitting ? <CircularProgress size={24} /> : 'Update Configuration'}
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  )
}

export default AppConfigManager
