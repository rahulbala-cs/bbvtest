import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Tabs, Tab, Box } from '@mui/material'

const Navigation: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const getCurrentTab = () => {
    switch (location.pathname) {
      case '/config':
        return 0
      case '/polls':
        return 1
      case '/promos':
        return 2
      case '/twitter':
        return 3
      case '/contestants':
        return 4
      case '/news':
        return 5
      case '/notifications':
        return 6
      default:
        return 0
    }
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const routes = ['/config', '/polls', '/promos', '/twitter', '/contestants', '/news', '/notifications']
    navigate(routes[newValue])
  }

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={getCurrentTab()} onChange={handleChange} aria-label="admin navigation" variant="scrollable" scrollButtons="auto">
        <Tab label="App Config" />
        <Tab label="Polls" />
        <Tab label="Promo Videos" />
        <Tab label="Twitter Feed" />
        <Tab label="Contestants" />
        <Tab label="News" />
        <Tab label="Notifications" />
      </Tabs>
    </Box>
  )
}

export default Navigation