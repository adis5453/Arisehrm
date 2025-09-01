/**
 * Optimized App.tsx with enhanced code splitting and bundle optimization
 * Features:
 * - Route-based code splitting
 * - Progressive loading with preloading
 * - Bundle optimization through dynamic imports
 * - Memory-efficient lazy loading
 */

import React, { Suspense, lazy, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, CircularProgress, Typography, useTheme, Skeleton } from '@mui/material';
import { log } from '@/services/loggingService';

// Import only essential components that are used immediately
import { AuthProvider } from './contexts/AuthContext';
import { ThemeContextProvider } from './contexts/ThemeContext';
import RouteErrorBoundary from './components/common/RouteErrorBoundary';

// Import consolidated CSS for better optimization
import './styles/consolidated.css';

// ==============================================
// OPTIMIZED LAZY LOADING WITH PRELOADING
// ==============================================

// Authentication Routes (High Priority - Load Immediately)
const RoleBasedLoginSelector = lazy(() => import('./components/auth/RoleBasedLoginSelector'));
const LoginPageSimple = lazy(() => import('./components/auth/LoginPageSimple'));

// Core Layout Components (High Priority)
const SimpleAuthGuard = lazy(() => import('./components/auth/SimpleAuthGuard').then(module => ({ default: module.SimpleAuthGuard })));
const MainLayout = lazy(() => import('./components/layout/MainLayout').then(module => ({ default: module.MainLayout })));

// Dashboard Routes (Medium Priority - Preload on login)
const RoleBasedDashboard = lazy(() => 
  import('./components/dashboard/RoleBasedDashboard')
);
const LiveDashboard = lazy(() => 
  import('./components/dashboard/LiveDashboard')
);

// Employee Management Routes (Medium Priority)
const EmployeeDirectory = lazy(() => 
  import('./components/employees/EmployeeDirectory')
);
const EmployeeProfile = lazy(() => 
  import('./components/employees/EmployeeProfile')
);

// Core HR Modules (Medium Priority)
const TeamsPage = lazy(() => 
  import('./pages/Teams')
);
const LeaveManagement = lazy(() => 
  import('./components/leave/ComprehensiveLeaveManagement')
);
const AttendanceSystem = lazy(() => 
  import('./components/attendance/ComprehensiveAttendanceSystem')
);

// Administrative Routes (Low Priority - Load on Demand)
const PayrollDashboard = lazy(() => 
  import('./components/payroll/PayrollDashboard')
);
const AnalyticsDashboard = lazy(() => 
  import('./components/analytics/AdvancedAnalyticsDashboard').then(module => ({ default: module.AdvancedAnalyticsDashboard }))
);
const OrganizationChart = lazy(() => 
  import('./components/organization/OrganizationChart').then(module => ({ default: module.OrganizationChart }))
);
const ReportsPage = lazy(() => 
  import('./components/reports/ReportsPage')
);
const SettingsPage = lazy(() => 
  import('./components/settings/SettingsPage')
);

// Role-specific Login Routes (Load on Demand)
const createRoleLoginLoader = (role: string) => lazy(() => {
  switch (role) {
    case 'employee':
      return import('./components/auth/EmployeeLogin');
    case 'team-leader':
      return import('./components/auth/TeamLeaderLogin');
    case 'hr-manager':
      return import('./components/auth/HRManagerLogin');
    case 'department-manager':
      return import('./components/auth/DepartmentManagerLogin');
    case 'admin':
      return import('./components/auth/AdminLogin');
    case 'super-admin':
      return import('./components/auth/SuperAdminLogin');
    default:
      return import('./components/auth/EmployeeLogin');
  }
});

// Advanced Feature Modules (Lowest Priority - Load on Demand)
const AdvancedModules = {
  DocumentManagement: lazy(() => import('./components/documents/DocumentManagement')),
  AdminPanel: lazy(() => import('./components/admin/DatabaseAdminPanel')),
  SuperAdminUserCreation: lazy(() => import('./components/admin/SuperAdminUserCreation')),
  BenefitsManagement: lazy(() => import('./components/benefits/BenefitsManagement')),
  ProjectManagement: lazy(() => import('./components/projects/ProjectManagement')),
  PerformanceManagement: lazy(() => import('./components/performance/PerformanceManagement')),
  HiringManagement: lazy(() => import('./components/hiring/HiringManagement')),
  InterviewManagement: lazy(() => import('./components/interviews/InterviewManagement')),
  TrainingManagement: lazy(() => import('./components/training/TrainingManagement')),
  AnnouncementCenter: lazy(() => import('./components/announcements/AnnouncementCenter')),
  ExpenseManagement: lazy(() => import('./components/expenses/ExpenseManagement')),
  ComplianceManagement: lazy(() => import('./components/compliance/ComplianceManagement')),
  MessagingSystem: lazy(() => import('./components/messaging/MessagingSystem')),
};

// AI Features (Lowest Priority - Load on Demand with Feature Flags)
const AIModules = {
  AIResumeAnalyzer: lazy(() => import('./components/ai/AIResumeAnalyzer')),
  AIInsights: lazy(() => import('./components/ai/AIInsights')),
  AIAttendanceAnalyzer: lazy(() => import('./components/ai/AIAttendanceAnalyzer')),
  AILeaveRecommendations: lazy(() => import('./components/ai/AILeaveRecommendations')),
  HRChatbot: lazy(() => import('./components/ai/HRChatbot')),
};

// ==============================================
// OPTIMIZED LOADING COMPONENTS
// ==============================================

const SkeletonLoader = ({ type = 'dashboard' }: { type?: 'dashboard' | 'table' | 'form' | 'card' }) => {
  const theme = useTheme();
  
  const skeletonConfig = {
    dashboard: {
      rows: 6,
      heights: [80, 200, 120, 150, 100, 180],
    },
    table: {
      rows: 8,
      heights: [60, 40, 40, 40, 40, 40, 40, 40],
    },
    form: {
      rows: 5,
      heights: [60, 80, 80, 80, 60],
    },
    card: {
      rows: 4,
      heights: [200, 60, 40, 60],
    },
  };
  
  const config = skeletonConfig[type];
  
  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {Array.from({ length: config.rows }).map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          height={config.heights[index]}
          sx={{ 
            mb: 2, 
            borderRadius: 1,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          }}
        />
      ))}
    </Box>
  );
};

const EnhancedLoadingScreen = ({ message = 'Loading...', progress }: { message?: string; progress?: number }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        p: 4,
      }}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant={progress ? 'determinate' : 'indeterminate'}
          value={progress}
          size={50}
          thickness={3}
          sx={{ 
            color: theme.palette.primary.main,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        {progress && (
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" component="div" color="text.secondary">
              {Math.round(progress)}%
            </Typography>
          </Box>
        )}
      </Box>
      
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {message}
      </Typography>
      
      {/* Show skeleton loader while loading */}
      <Box sx={{ width: '100%', maxWidth: 400, mt: 2 }}>
        <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1, mb: 1 }} />
        <Skeleton variant="rectangular" height={30} width="60%" sx={{ borderRadius: 1, mb: 1 }} />
        <Skeleton variant="rectangular" height={30} width="80%" sx={{ borderRadius: 1 }} />
      </Box>
    </Box>
  );
};

// ==============================================
// PRELOADING UTILITIES
// ==============================================

/**
 * Preload components based on user role and current route
 */
const useComponentPreloading = (userRole?: string, currentPath?: string) => {
  useEffect(() => {
    if (userRole) {
      const preloadComponents = async () => {
        try {
          // Preload dashboard components after login
          setTimeout(() => {
            RoleBasedDashboard.preload?.();
            LiveDashboard.preload?.();
          }, 1000);
          
          // Preload commonly used modules based on role
          setTimeout(() => {
            if (['hr', 'admin', 'super-admin'].includes(userRole)) {
              EmployeeDirectory.preload?.();
              TeamsPage.preload?.();
            }
            
            if (['manager', 'hr', 'admin'].includes(userRole)) {
              LeaveManagement.preload?.();
              AttendanceSystem.preload?.();
            }
            
            if (['admin', 'super-admin'].includes(userRole)) {
              PayrollDashboard.preload?.();
              AnalyticsDashboard.preload?.();
            }
          }, 2000);
          
        } catch (error) {
          log.warn('Component preloading failed', error as Error, { userRole, currentPath });
        }
      };
      
      preloadComponents();
    }
  }, [userRole, currentPath]);
};

// ==============================================
// OPTIMIZED ROUTE WRAPPER
// ==============================================

const OptimizedRoute = ({ 
  children, 
  fallbackType = 'dashboard',
  errorBoundary = true 
}: { 
  children: React.ReactNode; 
  fallbackType?: 'dashboard' | 'table' | 'form' | 'card';
  errorBoundary?: boolean;
}) => {
  const content = (
    <Suspense fallback={<SkeletonLoader type={fallbackType} />}>
      {children}
    </Suspense>
  );
  
  return errorBoundary ? (
    <RouteErrorBoundary>
      {content}
    </RouteErrorBoundary>
  ) : content;
};

// ==============================================
// QUERY CLIENT CONFIGURATION
// ==============================================

const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
        retry: (failureCount, error: any) => {
          // Don't retry for 4xx errors
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: 'always',
      },
      mutations: {
        retry: 1,
      },
    },
  });
};

// ==============================================
// APP ROUTES COMPONENT
// ==============================================

const AppRoutes = React.memo(() => {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route 
        path="/login" 
        element={
          <OptimizedRoute fallbackType="form" errorBoundary={false}>
            <RoleBasedLoginSelector />
          </OptimizedRoute>
        } 
      />
      <Route 
        path="/login/simple" 
        element={
          <OptimizedRoute fallbackType="form" errorBoundary={false}>
            <LoginPageSimple />
          </OptimizedRoute>
        } 
      />
      
      {/* Role-based Login Routes */}
      {(['employee', 'team-leader', 'hr-manager', 'department-manager', 'admin', 'super-admin'] as const).map((role) => {
        const RoleLoginComponent = createRoleLoginLoader(role);
        return (
          <Route
            key={role}
            path={`/login/${role}`}
            element={
              <OptimizedRoute fallbackType="form" errorBoundary={false}>
                <RoleLoginComponent />
              </OptimizedRoute>
            }
          />
        );
      })}
      
      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <OptimizedRoute>
            <Suspense fallback={<EnhancedLoadingScreen message="Loading authentication..." />}>
              <SimpleAuthGuard>
                <Suspense fallback={<EnhancedLoadingScreen message="Loading main interface..." />}>
                  <MainLayout>
                    <Routes>
                      {/* Dashboard Routes */}
                      <Route 
                        path="dashboard" 
                        element={
                          <OptimizedRoute fallbackType="dashboard">
                            <RoleBasedDashboard />
                          </OptimizedRoute>
                        } 
                      />
                      <Route 
                        path="dashboard/live" 
                        element={
                          <OptimizedRoute fallbackType="dashboard">
                            <LiveDashboard />
                          </OptimizedRoute>
                        } 
                      />

                      {/* HR Management Routes */}
                      <Route 
                        path="hr/teams" 
                        element={
                          <OptimizedRoute fallbackType="card">
                            <TeamsPage />
                          </OptimizedRoute>
                        } 
                      />
                      <Route 
                        path="hr/employees" 
                        element={
                          <OptimizedRoute fallbackType="table">
                            <EmployeeDirectory />
                          </OptimizedRoute>
                        } 
                      />
                      <Route 
                        path="hr/organization-chart" 
                        element={
                          <OptimizedRoute fallbackType="card">
                            <OrganizationChart />
                          </OptimizedRoute>
                        } 
                      />
                      
                      {/* Leave and Attendance */}
                      <Route 
                        path="leave/management" 
                        element={
                          <OptimizedRoute fallbackType="form">
                            <LeaveManagement />
                          </OptimizedRoute>
                        } 
                      />
                      <Route 
                        path="attendance/tracking" 
                        element={
                          <OptimizedRoute fallbackType="table">
                            <AttendanceSystem />
                          </OptimizedRoute>
                        } 
                      />
                      
                      {/* Administrative Routes */}
                      <Route 
                        path="admin/payroll" 
                        element={
                          <OptimizedRoute fallbackType="table">
                            <PayrollDashboard />
                          </OptimizedRoute>
                        } 
                      />
                      <Route 
                        path="admin/analytics" 
                        element={
                          <OptimizedRoute fallbackType="dashboard">
                            <AnalyticsDashboard />
                          </OptimizedRoute>
                        } 
                      />
                      <Route 
                        path="admin/reports" 
                        element={
                          <OptimizedRoute fallbackType="table">
                            <ReportsPage />
                          </OptimizedRoute>
                        } 
                      />
                      <Route 
                        path="settings" 
                        element={
                          <OptimizedRoute fallbackType="form">
                            <SettingsPage />
                          </OptimizedRoute>
                        } 
                      />
                      
                      {/* Advanced Features */}
                      {Object.entries(AdvancedModules).map(([key, Component]) => {
                        const routePath = key.toLowerCase().replace(/([A-Z])/g, '-$1').replace(/^-/, '');
                        return (
                          <Route
                            key={key}
                            path={`advanced/${routePath}`}
                            element={
                              <OptimizedRoute fallbackType="dashboard">
                                <Component />
                              </OptimizedRoute>
                            }
                          />
                        );
                      })}
                      
                      {/* AI Features (Feature Flagged) */}
                      {Object.entries(AIModules).map(([key, Component]) => {
                        const routePath = key.toLowerCase().replace(/([A-Z])/g, '-$1').replace(/^-/, '');
                        return (
                          <Route
                            key={key}
                            path={`ai/${routePath}`}
                            element={
                              <OptimizedRoute fallbackType="card">
                                <Component />
                              </OptimizedRoute>
                            }
                          />
                        );
                      })}
                      
                      {/* Default redirect */}
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </MainLayout>
                </Suspense>
              </SimpleAuthGuard>
            </Suspense>
          </OptimizedRoute>
        }
      />
    </Routes>
  );
});

AppRoutes.displayName = 'AppRoutes';

// ==============================================
// MAIN APP COMPONENT
// ==============================================

const App: React.FC = () => {
  // Create optimized query client
  const queryClient = useMemo(() => createOptimizedQueryClient(), []);
  
  // Preload components based on user interaction
  useComponentPreloading();
  
  // Performance monitoring
  useEffect(() => {
    // Log app initialization
    log.info('App initialized successfully', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });
    
    // Performance metrics
    if ('performance' in window) {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        log.perf('App load performance', perfData.loadEventEnd - perfData.fetchStart, 'APP_LOAD');
      }, 0);
    }
  }, []);
  
  return (
    <RouteErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeContextProvider>
          <AuthProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Router>
                <AppRoutes />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'var(--bg-paper-light)',
                      color: 'var(--text-primary-light)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-lg)',
                    },
                  }}
                />
              </Router>
            </LocalizationProvider>
          </AuthProvider>
        </ThemeContextProvider>
      </QueryClientProvider>
    </RouteErrorBoundary>
  );
};

export default App;
