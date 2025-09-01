'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box, Card, CardContent, TextField, Button, Typography, InputAdornment,
  IconButton, FormControlLabel, Checkbox, Alert, Container, Stack,
  Avatar, LinearProgress, Divider, Link, useTheme, useMediaQuery,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip, Paper,
  Stepper, Step, StepLabel, StepContent, Fade, Grow, Slide
} from '@mui/material'
import { styled } from '@mui/material/styles'
import {
  Visibility, VisibilityOff, Email, Lock, Security, Shield,
  DeviceHub, LocationOn, VpnKey, Warning, CheckCircle,
  Fingerprint, Assignment, Person, AdminPanelSettings,
  SupervisorAccount, People, Business, Group, Star
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'sonner'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'
import { 
  advancedLoginService, 
  RoleDetectionResult, 
  SecurityAssessment,
  TemporaryPasswordResult 
} from '../../services/advancedLoginService'

// Styled Components
const EnhancedLoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(239, 68, 68, 0.05) 0%, transparent 50%)
    `,
  },
}))

const SecurityCard = styled(Card)(({ theme }) => ({
  background: 'rgba(15, 23, 42, 0.9)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(59, 130, 246, 0.2)',
  borderRadius: theme.spacing(3),
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.8), transparent)',
  },
}))

const EnhancedTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: theme.spacing(2),
    '& fieldset': {
      borderColor: 'rgba(59, 130, 246, 0.3)',
      borderWidth: 1,
    },
    '&:hover fieldset': {
      borderColor: 'rgba(59, 130, 246, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3b82f6',
      borderWidth: 2,
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
    '&.Mui-error fieldset': {
      borderColor: '#ef4444',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#cbd5e1',
    '&.Mui-focused': {
      color: '#3b82f6',
    },
    '&.Mui-error': {
      color: '#ef4444',
    },
  },
  '& .MuiOutlinedInput-input': {
    color: '#f8fafc',
    fontSize: '1rem',
  },
  '& .MuiFormHelperText-root': {
    color: '#ef4444',
    '&.Mui-error': {
      color: '#ef4444',
    },
  },
}))

const SecurityButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
  borderRadius: 16,
  padding: '16px 32px',
  fontSize: '1.1rem',
  fontWeight: 700,
  textTransform: 'none',
  color: 'white',
  border: 'none',
  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.5s ease',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #db2777 100%)',
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: '0 15px 35px rgba(59, 130, 246, 0.6)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(-1px) scale(0.98)',
  },
  '&:disabled': {
    background: 'rgba(59, 130, 246, 0.3)',
    transform: 'none',
    boxShadow: 'none',
  },
}))

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
  deviceTrust: boolean
  newPassword?: string
  confirmPassword?: string
}

interface EnhancedLoginState {
  step: 'email' | 'password' | 'role_detection' | 'security_check' | 'temp_password' | 'success'
  roleDetection: RoleDetectionResult | null
  securityAssessment: SecurityAssessment | null
  tempPasswordResult: TemporaryPasswordResult | null
  requiresPasswordChange: boolean
  showRoleSelector: boolean
  selectedRole: string | null
}

export function EnhancedLoginPage() {
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
    deviceTrust: false,
    newPassword: '',
    confirmPassword: ''
  })

  // Enhanced login state
  const [loginState, setLoginState] = useState<EnhancedLoginState>({
    step: 'email',
    roleDetection: null,
    securityAssessment: null,
    tempPasswordResult: null,
    requiresPasswordChange: false,
    showRoleSelector: false,
    selectedRole: null
  })

  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginProgress, setLoginProgress] = useState(0)
  const [securityDialogOpen, setSecurityDialogOpen] = useState(false)

  // Role icons mapping
  const getRoleIcon = (role: string) => {
    const icons = {
      super_admin: <SupervisorAccount />,
      admin: <AdminPanelSettings />,
      hr_manager: <People />,
      department_manager: <Business />,
      team_lead: <Group />,
      senior_employee: <Star />,
      employee: <Person />
    }
    return icons[role as keyof typeof icons] || <Person />
  }

  // Handle email detection step
  const handleEmailDetection = useCallback(async () => {
    if (!formData.email.trim()) {
      setErrors({ email: 'Email is required' })
      return
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' })
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Detect role from email
      const roleDetection = await advancedLoginService.detectRoleFromEmail(formData.email)
      
      setLoginState(prev => ({ 
        ...prev, 
        roleDetection,
        step: roleDetection.requiresApproval ? 'role_detection' : 'password'
      }))

      if (roleDetection.requiresApproval) {
        toast.info(`Role detected: ${roleDetection.suggestedRole}`, {
          description: 'Please confirm or select a different role'
        })
      } else {
        toast.success(`Welcome ${roleDetection.suggestedRole}!`, {
          description: `Confidence: ${roleDetection.confidence}%`
        })
      }

    } catch (error) {
      setErrors({ email: 'Failed to validate email address' })
      toast.error('Email validation failed')
    } finally {
      setIsSubmitting(false)
    }
  }, [formData.email])

  // Handle login attempt
  const handleLogin = useCallback(async () => {
    if (!formData.password) {
      setErrors({ password: 'Password is required' })
      return
    }

    setIsSubmitting(true)
    setLoginProgress(0)
    
    const progressInterval = setInterval(() => {
      setLoginProgress(prev => Math.min(prev + Math.random() * 20, 85))
    }, 200)

    try {
      // Check if this is a temporary password login
      if (loginState.tempPasswordResult) {
        const result = await advancedLoginService.validateTemporaryPasswordLogin(
          formData.email,
          formData.password,
          formData.newPassword
        )

        if (result.requiresPasswordChange) {
          setLoginState(prev => ({ ...prev, requiresPasswordChange: true, step: 'temp_password' }))
          return
        }

        if (!result.success) {
          throw new Error(result.error)
        }

        // Successful temporary password login
        clearInterval(progressInterval)
        setLoginProgress(100)
        setLoginState(prev => ({ ...prev, step: 'success' }))
        
        toast.success('Account activated successfully!')
        setTimeout(() => navigate('/dashboard'), 2000)
        return
      }

      // Regular advanced login
      const advancedResult = await advancedLoginService.performAdvancedLogin(
        formData.email,
        formData.password,
        {
          rememberMe: formData.rememberMe,
          deviceTrust: formData.deviceTrust
        }
      )

      if (advancedResult.requiresAdditionalVerification) {
        setLoginState(prev => ({ 
          ...prev, 
          securityAssessment: advancedResult.securityAssessment,
          step: 'security_check'
        }))
        setSecurityDialogOpen(true)
        return
      }

      // Regular login through auth context
      const authResult = await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
        deviceTrust: formData.deviceTrust
      })

      clearInterval(progressInterval)
      setLoginProgress(100)

      if (authResult.success) {
        setLoginState(prev => ({ ...prev, step: 'success' }))
        toast.success('Login successful!')
        
        setTimeout(() => {
          const redirectTo = location.state?.from?.pathname || '/dashboard'
          navigate(redirectTo, { replace: true })
        }, 1500)
      } else {
        throw new Error(authResult.error)
      }

    } catch (error: any) {
      clearInterval(progressInterval)
      setLoginProgress(0)
      
      // Check if it's a temporary password error
      if (error.message.includes('temporary password')) {
        setLoginState(prev => ({ ...prev, step: 'temp_password' }))
        toast.info('Please use your temporary password or set a new one')
      } else {
        setErrors({ password: error.message || 'Login failed' })
        toast.error(error.message || 'Login failed')
      }
    } finally {
      setIsSubmitting(false)
      clearInterval(progressInterval)
    }
  }, [formData, login, navigate, location, loginState])

  // Handle temporary password creation
  const handleCreateTempPassword = useCallback(async () => {
    if (!loginState.roleDetection?.suggestedRole) return

    setIsSubmitting(true)
    try {
      const tempResult = await advancedLoginService.createTemporaryPassword(
        formData.email,
        loginState.selectedRole || loginState.roleDetection.suggestedRole,
        'system'
      )

      setLoginState(prev => ({ ...prev, tempPasswordResult: tempResult, step: 'temp_password' }))
      
      toast.success('Temporary password created!', {
        description: 'Check your email for login instructions'
      })

    } catch (error: any) {
      toast.error('Failed to create temporary password')
    } finally {
      setIsSubmitting(false)
    }
  }, [formData.email, loginState])

  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleRoleSelect = (role: string) => {
    setLoginState(prev => ({ ...prev, selectedRole: role, step: 'password' }))
    toast.success(`Role selected: ${role}`)
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return '#10b981'
      case 'medium': return '#f59e0b'
      case 'high': return '#ef4444'
      case 'critical': return '#dc2626'
      default: return '#6b7280'
    }
  }

  const currentStep = ['email', 'role_detection', 'password', 'security_check', 'temp_password', 'success'].indexOf(loginState.step)

  return (
    <EnhancedLoginContainer>
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <SecurityCard>
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              
              {/* Header */}
              <Stack alignItems="center" spacing={2} mb={4}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  }}
                >
                  <Security sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: '#f8fafc', 
                    fontWeight: 800,
                    textAlign: 'center'
                  }}
                >
                  Enhanced Login
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#cbd5e1', 
                    textAlign: 'center',
                    opacity: 0.9
                  }}
                >
                  Advanced security with automatic role detection
                </Typography>
              </Stack>

              {/* Progress Stepper */}
              <Box sx={{ mb: 4 }}>
                <Stepper activeStep={currentStep} orientation="horizontal" sx={{
                  '& .MuiStepIcon-root': {
                    color: 'rgba(59, 130, 246, 0.3)',
                    '&.Mui-active': {
                      color: '#3b82f6',
                    },
                    '& .MuiStepIcon-text': {
                      fill: '#fff',
                    },
                  },
                  '& .MuiStepLabel-label': {
                    color: '#94a3b8',
                    '&.Mui-active': {
                      color: '#f8fafc',
                    },
                  },
                  '& .MuiStepConnector-line': {
                    borderColor: 'rgba(59, 130, 246, 0.3)',
                  },
                }}>
                  <Step>
                    <StepLabel>Email</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Role</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Security</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Success</StepLabel>
                  </Step>
                </Stepper>
              </Box>

              {/* Progress Bar */}
              {(isLoading || isSubmitting) && (
                <Box sx={{ mb: 3 }}>
                  <LinearProgress
                    variant={loginProgress > 0 ? "determinate" : "indeterminate"}
                    value={loginProgress}
                    sx={{
                      borderRadius: 2,
                      height: 8,
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                        borderRadius: 2,
                      },
                    }}
                  />
                  {loginProgress > 0 && (
                    <Typography 
                      variant="body2" 
                      sx={{ color: '#cbd5e1', mt: 1, textAlign: 'center' }}
                    >
                      Processing... {Math.round(loginProgress)}%
                    </Typography>
                  )}
                </Box>
              )}

              {/* Step Content */}
              <AnimatePresence mode="wait">
                
                {/* Email Step */}
                {loginState.step === 'email' && (
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                  >
                    <Stack spacing={3}>
                      <EnhancedTextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        error={!!errors.email}
                        helperText={errors.email}
                        disabled={isSubmitting}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email sx={{ color: '#3b82f6' }} />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <SecurityButton
                        fullWidth
                        size="large"
                        onClick={handleEmailDetection}
                        disabled={isSubmitting || !formData.email}
                      >
                        {isSubmitting ? 'Analyzing...' : 'Detect Role & Continue'}
                      </SecurityButton>
                    </Stack>
                  </motion.div>
                )}

                {/* Role Detection Step */}
                {loginState.step === 'role_detection' && loginState.roleDetection && (
                  <motion.div
                    key="role-detection"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                  >
                    <Stack spacing={3}>
                      <Paper sx={{ 
                        p: 3, 
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)'
                      }}>
                        <Typography variant="h6" sx={{ color: '#f8fafc', mb: 2 }}>
                          Role Detected
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                          {getRoleIcon(loginState.roleDetection.suggestedRole)}
                          <Box flex={1}>
                            <Typography variant="subtitle1" sx={{ color: '#f8fafc' }}>
                              {loginState.roleDetection.suggestedRole.replace('_', ' ').toUpperCase()}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                              Confidence: {loginState.roleDetection.confidence}%
                            </Typography>
                          </Box>
                          <Chip 
                            label={`${loginState.roleDetection.confidence}%`}
                            color={loginState.roleDetection.confidence >= 80 ? 'success' : 'warning'}
                            size="small"
                          />
                        </Stack>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                          {loginState.roleDetection.matchedRule.description}
                        </Typography>
                      </Paper>

                      {/* Alternative Roles */}
                      {loginState.roleDetection.alternativeRoles && loginState.roleDetection.alternativeRoles.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: '#cbd5e1', mb: 2 }}>
                            Alternative Roles:
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {loginState.roleDetection.alternativeRoles.map(role => (
                              <Chip
                                key={role}
                                label={role.replace('_', ' ')}
                                variant="outlined"
                                size="small"
                                onClick={() => handleRoleSelect(role)}
                                sx={{
                                  color: '#cbd5e1',
                                  borderColor: 'rgba(59, 130, 246, 0.3)',
                                  '&:hover': {
                                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                    borderColor: '#3b82f6',
                                  }
                                }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}

                      <Stack direction="row" spacing={2}>
                        <SecurityButton
                          fullWidth
                          onClick={() => handleRoleSelect(loginState.roleDetection!.suggestedRole)}
                        >
                          Confirm Role
                        </SecurityButton>
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={handleCreateTempPassword}
                          sx={{ 
                            borderColor: 'rgba(59, 130, 246, 0.5)',
                            color: '#3b82f6',
                            '&:hover': {
                              borderColor: '#3b82f6',
                              backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            }
                          }}
                        >
                          Create New Account
                        </Button>
                      </Stack>
                    </Stack>
                  </motion.div>
                )}

                {/* Password Step */}
                {loginState.step === 'password' && (
                  <motion.div
                    key="password"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                  >
                    <Stack spacing={3}>
                      <EnhancedTextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange('password')}
                        error={!!errors.password}
                        helperText={errors.password}
                        disabled={isSubmitting}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock sx={{ color: '#3b82f6' }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                disabled={isSubmitting}
                                sx={{ color: '#3b82f6' }}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />

                      {formData.password && (
                        <PasswordStrengthMeter password={formData.password} />
                      )}

                      <Stack spacing={2}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.rememberMe}
                              onChange={handleInputChange('rememberMe')}
                              sx={{
                                color: '#3b82f6',
                                '&.Mui-checked': {
                                  color: '#3b82f6',
                                },
                              }}
                            />
                          }
                          label={
                            <Typography sx={{ color: '#cbd5e1' }}>
                              Remember me
                            </Typography>
                          }
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.deviceTrust}
                              onChange={handleInputChange('deviceTrust')}
                              sx={{
                                color: '#3b82f6',
                                '&.Mui-checked': {
                                  color: '#3b82f6',
                                },
                              }}
                            />
                          }
                          label={
                            <Typography sx={{ color: '#cbd5e1' }}>
                              Trust this device
                            </Typography>
                          }
                        />
                      </Stack>

                      <SecurityButton
                        fullWidth
                        size="large"
                        onClick={handleLogin}
                        disabled={isSubmitting || !formData.password}
                      >
                        {isSubmitting ? 'Authenticating...' : 'Secure Login'}
                      </SecurityButton>
                    </Stack>
                  </motion.div>
                )}

                {/* Temporary Password Step */}
                {loginState.step === 'temp_password' && (
                  <motion.div
                    key="temp-password"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                  >
                    <Stack spacing={3}>
                      {loginState.tempPasswordResult && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                          <Typography variant="body2">
                            Temporary password: <strong>{loginState.tempPasswordResult.temporaryPassword}</strong>
                          </Typography>
                          <Typography variant="caption" display="block">
                            Expires: {new Date(loginState.tempPasswordResult.expiresAt).toLocaleDateString()}
                          </Typography>
                        </Alert>
                      )}

                      {loginState.requiresPasswordChange && (
                        <>
                          <EnhancedTextField
                            fullWidth
                            label="New Password"
                            type={showNewPassword ? 'text' : 'password'}
                            value={formData.newPassword}
                            onChange={handleInputChange('newPassword')}
                            error={!!errors.newPassword}
                            helperText={errors.newPassword}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <VpnKey sx={{ color: '#3b82f6' }} />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    edge="end"
                                    sx={{ color: '#3b82f6' }}
                                  >
                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />

                          <EnhancedTextField
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange('confirmPassword')}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                          />
                        </>
                      )}

                      <SecurityButton
                        fullWidth
                        size="large"
                        onClick={handleLogin}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Creating Account...' : 'Activate Account'}
                      </SecurityButton>
                    </Stack>
                  </motion.div>
                )}

                {/* Success Step */}
                {loginState.step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Stack alignItems="center" spacing={3}>
                      <Avatar sx={{ 
                        width: 80, 
                        height: 80, 
                        backgroundColor: '#10b981' 
                      }}>
                        <CheckCircle sx={{ fontSize: 40 }} />
                      </Avatar>
                      <Typography variant="h4" sx={{ color: '#f8fafc', textAlign: 'center' }}>
                        Login Successful!
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#cbd5e1', textAlign: 'center' }}>
                        Redirecting to your dashboard...
                      </Typography>
                    </Stack>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Footer */}
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  🔒 Enhanced security • Role-based access • Advanced protection
                </Typography>
              </Box>

            </CardContent>
          </SecurityCard>
        </motion.div>

        {/* Security Assessment Dialog */}
        <Dialog
          open={securityDialogOpen}
          onClose={() => setSecurityDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ color: '#1f2937' }}>
            Security Assessment
          </DialogTitle>
          <DialogContent>
            {loginState.securityAssessment && (
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Risk Level: 
                    <Chip 
                      label={loginState.securityAssessment.riskLevel.toUpperCase()}
                      sx={{ 
                        ml: 1,
                        backgroundColor: getRiskLevelColor(loginState.securityAssessment.riskLevel),
                        color: 'white'
                      }}
                    />
                  </Typography>
                </Box>

                {loginState.securityAssessment.riskFactors.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Risk Factors:
                    </Typography>
                    {loginState.securityAssessment.riskFactors.map(factor => (
                      <Chip key={factor} label={factor.replace('_', ' ')} size="small" sx={{ mr: 1, mb: 1 }} />
                    ))}
                  </Box>
                )}

                {loginState.securityAssessment.recommendations.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Recommendations:
                    </Typography>
                    {loginState.securityAssessment.recommendations.map((rec, idx) => (
                      <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                        • {rec}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSecurityDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={() => {
                setSecurityDialogOpen(false)
                handleLogin()
              }}
              sx={{ backgroundColor: '#3b82f6' }}
            >
              Proceed
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </EnhancedLoginContainer>
  )
}

export default EnhancedLoginPage
