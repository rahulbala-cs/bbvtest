import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material'
import PollManager from './components/PollManager'
import ContestantManager from './components/ContestantManager'
import NewsManager from './components/NewsManager'
import NotificationSender from './components/NotificationSender'
import AppConfigManager from './components/AppConfigManager'
import PromoVideoManager from './components/PromoVideoManager'
import TwitterFeedManager from './components/TwitterFeedManager'
import Navigation from './components/Navigation'

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Bigg Boss Telugu - Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Navigation />
        
        <Box sx={{ mt: 3 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/config" replace />} />
            <Route path="/config" element={<AppConfigManager />} />
            <Route path="/polls" element={<PollManager />} />
            <Route path="/promos" element={<PromoVideoManager />} />
            <Route path="/twitter" element={<TwitterFeedManager />} />
            <Route path="/contestants" element={<ContestantManager />} />
            <Route path="/news" element={<NewsManager />} />
            <Route path="/notifications" element={<NotificationSender />} />
          </Routes>
        </Box>
      </Container>
    </Box>
  )
}

export default App