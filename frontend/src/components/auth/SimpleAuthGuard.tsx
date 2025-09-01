import React, { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'

interface SimpleAuthGuardProps {
  children: ReactNode
}

export const SimpleAuthGuard: React.FC<SimpleAuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user, profile } = useAuth()
  const navigate = useNavigate()

  // Fix navigation loop by using useEffect
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      navigate('/login', { replace: true })
    }
  }, [isAuthenticated, isLoading, user, navigate])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Authenticating...
        </Typography>
      </Box>
    )
  }

  // Don't render anything during redirect
  if (!isAuthenticated || !user) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Redirecting to login...
        </Typography>
      </Box>
    )
  }

  // ✅ FIXED: Render children if authenticated (profile fallback ensures profile exists)
  return <>{children}</>
}

export default SimpleAuthGuard
