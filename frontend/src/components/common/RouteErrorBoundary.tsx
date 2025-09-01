'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Alert,
  AlertTitle,
  Stack,
} from '@mui/material'
import { Error as ErrorIcon, Refresh as RefreshIcon, Home as HomeIcon } from '@mui/icons-material'
import { log } from '../../services/loggingService'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  routeName?: string
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class RouteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Log error using our logging service
    log.error(`Route Error in ${this.props.routeName || 'Unknown Route'}`, error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return <RouteErrorFallback 
        error={this.state.error} 
        errorInfo={this.state.errorInfo}
        routeName={this.props.routeName}
      />
    }

    return this.props.children
  }
}

interface RouteErrorFallbackProps {
  error: Error | null
  errorInfo: ErrorInfo | null
  routeName?: string
}

const RouteErrorFallback: React.FC<RouteErrorFallbackProps> = ({ error, errorInfo, routeName }) => {
  const handleRefresh = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <ErrorIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
        
        <Typography variant="h4" component="h1" gutterBottom color="error">
          {routeName ? `Error loading ${routeName}` : 'Route Error'}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          We encountered an error loading this page. Please try refreshing or go back to the dashboard.
        </Typography>

        {process.env.NODE_ENV === 'development' && error && (
          <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
            <AlertTitle>Error Details (Development)</AlertTitle>
            <Typography variant="body2" component="pre" sx={{ 
              whiteSpace: 'pre-wrap', 
              fontSize: '0.875rem',
              fontFamily: 'monospace'
            }}>
              {error.toString()}
            </Typography>
            {errorInfo && (
              <Typography variant="body2" component="pre" sx={{ 
                whiteSpace: 'pre-wrap', 
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                mt: 1
              }}>
                {errorInfo.componentStack}
              </Typography>
            )}
          </Alert>
        )}

        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            size="large"
          >
            Refresh Page
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
            size="large"
          >
            Go to Dashboard
          </Button>
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
          If this problem persists, please contact support.
        </Typography>
      </Paper>
    </Container>
  )
}

export default RouteErrorBoundary