'use client'

import React from 'react'
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Badge,
  Tooltip,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Stack,
  alpha,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  People,
  Schedule,
  Assignment,
  Settings,
  Group,
  School,
  Folder,
  BarChart,
  ExpandLess,
  ExpandMore,
  Logout,
  PersonAdd,
  AccountTree,
  EmojiEvents,
  AssignmentTurnedIn,
  Security,
  AttachMoney,
  Person,
  Psychology,
  SmartToy,
  Assessment,
  CalendarToday,
  Analytics,
  Support,
  Campaign as CampaignIcon,
  LastPage,
  FirstPage,
  LocationOn,
  Business,
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { ThemeToggle } from '../common/ThemeToggle'

interface SidebarContentProps {
  mini?: boolean
  expandedItems: string[]
  onExpandClick: (itemId: string) => void
  onNavClick: (itemId: string, path: string) => void
  selectedNav: string
  onLogout: () => void
  onSettingsClick: () => void
  onHelpClick: () => void
  onSidebarMiniToggle: () => void
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  mini = false,
  expandedItems,
  onExpandClick,
  onNavClick,
  selectedNav,
  onLogout,
  onSettingsClick,
  onHelpClick,
  onSidebarMiniToggle,
}) => {
  const { profile } = useAuth()

  // Navigation Items
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      id: 'hr',
      label: 'Human Resources',
      icon: <People />,
      path: '/hr',
      children: [
        {
          id: 'employees',
          label: 'Employee Directory',
          icon: <Group />,
          path: '/hr/employees',
        },
        {
          id: 'employee-management',
          label: 'Employee Management',
          icon: <PersonAdd />,
          path: '/hr/employee-management',
        },
        {
          id: 'organization-chart',
          label: 'Organization Chart',
          icon: <AccountTree />,
          path: '/hr/organization-chart',
        },
        {
          id: 'hiring',
          label: 'Hiring & Recruitment',
          icon: <PersonAdd />,
          path: '/hr/hiring',
          badge: 3,
        },
        {
          id: 'interviews',
          label: 'Interview Management',
          icon: <AssignmentTurnedIn />,
          path: '/hr/interviews',
        },
        {
          id: 'performance',
          label: 'Performance Management',
          icon: <EmojiEvents />,
          path: '/hr/performance',
        },
        {
          id: 'training',
          label: 'Training & Learning',
          icon: <School />,
          path: '/hr/training',
        },
        {
          id: 'announcements',
          label: 'Announcements',
          icon: <CampaignIcon />,
          path: '/hr/announcements',
        },
        {
          id: 'compliance',
          label: 'Compliance',
          icon: <Security />,
          path: '/hr/compliance',
        },
        {
          id: 'expenses',
          label: 'Expenses',
          icon: <AttachMoney />,
          path: '/hr/expenses',
        },
      ]
    },
    {
      id: 'ai',
      label: 'AI Features',
      icon: <Psychology />,
      path: '/ai',
      children: [
        {
          id: 'resume-analyzer',
          label: 'Resume Analyzer',
          icon: <SmartToy />,
          path: '/ai/resume-analyzer',
        },
        {
          id: 'ai-insights',
          label: 'AI Insights',
          icon: <Analytics />,
          path: '/ai/insights',
        },
        {
          id: 'attendance-analyzer',
          label: 'Attendance Analyzer',
          icon: <Assessment />,
          path: '/ai/attendance-analyzer',
        },
        {
          id: 'leave-recommendations',
          label: 'Leave Recommendations',
          icon: <CalendarToday />,
          path: '/ai/leave-recommendations',
        },
        {
          id: 'hr-chatbot',
          label: 'HR Assistant',
          icon: <Support />,
          path: '/ai/chatbot',
        },
      ],
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: <Schedule />,
      path: '/attendance',
      children: [
        {
          id: 'attendance-tracking',
          label: 'Attendance Tracking',
          icon: <Schedule />,
          path: '/attendance',
        },
        {
          id: 'location-attendance',
          label: 'Location-based Attendance',
          icon: <LocationOn />,
          path: '/attendance/location',
        },
      ],
    },
    {
      id: 'leave',
      label: 'Leave Management',
      icon: <Assignment />,
      path: '/leave',
    },
    {
      id: 'payroll',
      label: 'Payroll',
      icon: <AttachMoney />,
      path: '/payroll',
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <Folder />,
      path: '/projects',
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: <BarChart />,
      path: '/reports',
    },
    {
      id: 'self-service',
      label: 'Self-Service',
      icon: <Person />,
      path: '/self-service',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings />,
      path: '/settings',
    },
  ]

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      color: 'inherit'
    }}>
      {/* Enhanced Logo/Header */}
      <Box sx={{ 
        p: mini ? 2 : 3, 
        textAlign: 'center', 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        minHeight: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {!mini ? (
          <Box>
            <Typography variant="h5" sx={{ 
              fontWeight: 700, 
              color: 'inherit', 
              mb: 0.5 
            }}>
              Arise HRM
            </Typography>
            <Typography variant="caption" sx={{ 
              color: alpha('#ffffff', 0.7)
            }}>
              Human Resource Management
            </Typography>
          </Box>
        ) : (
          <Avatar sx={{ 
            bgcolor: alpha('#ffffff', 0.1), 
            width: 40, 
            height: 40 
          }}>
            <Business />
          </Avatar>
        )}
      </Box>

      {/* Enhanced User Profile */}
      <Box sx={{ 
        p: mini ? 1.5 : 3, 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        minHeight: mini ? 70 : 100
      }}>
        <Stack 
          direction={mini ? 'column' : 'row'} 
          spacing={mini ? 1 : 2} 
          alignItems="center"
        >
          <Avatar
            src={profile?.profile_photo_url}
            sx={{ 
              width: mini ? 32 : 48, 
              height: mini ? 32 : 48,
              backgroundColor: alpha('#ffffff', 0.2),
            }}
          >
            {profile?.first_name?.[0]}{profile?.last_name?.[0]}
          </Avatar>
          {!mini && (
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body1" sx={{ 
                color: 'inherit', 
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {profile?.first_name} {profile?.last_name}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: alpha('#ffffff', 0.7),
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {profile?.role?.display_name || 'Administrator'}
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>

      {/* Enhanced Navigation with Fixed Scrolling */}
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}>
        <Box
          data-sidebar-scroll
          sx={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            py: 1,
            scrollBehavior: 'smooth',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255,255,255,0.3)',
              borderRadius: '3px',
              '&:hover': {
                background: 'rgba(255,255,255,0.5)',
              },
            },
          }}
        >
          <List sx={{ px: 1 }}>
            {navigationItems.map((item) => (
              <Box key={item.id}>
                <Tooltip 
                  title={mini ? item.label : ''} 
                  placement="right"
                  arrow
                >
                  <ListItemButton
                    onClick={() => {
                      if (item.children) {
                        onExpandClick(item.id)
                      } else {
                        onNavClick(item.id, item.path)
                      }
                    }}
                    selected={selectedNav === item.id}
                    sx={{
                      mb: 0.5,
                      borderRadius: 2,
                      color: 'inherit',
                      minHeight: 48,
                      '&.Mui-selected': {
                        backgroundColor: alpha('#ffffff', 0.15),
                        '&:hover': {
                          backgroundColor: alpha('#ffffff', 0.2),
                        },
                      },
                      '&:hover': {
                        backgroundColor: alpha('#ffffff', 0.1),
                      },
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: 'inherit', 
                      minWidth: mini ? 0 : 40,
                      justifyContent: 'center'
                    }}>
                      <Badge badgeContent={item.badge} color="error">
                        {item.icon}
                      </Badge>
                    </ListItemIcon>
                    {!mini && (
                      <>
                        <ListItemText 
                          primary={item.label}
                          primaryTypographyProps={{
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: 'inherit'
                          }}
                        />
                        {item.children && (
                          expandedItems.includes(item.id) ? <ExpandLess /> : <ExpandMore />
                        )}
                      </>
                    )}
                  </ListItemButton>
                </Tooltip>

                {/* Submenu */}
                {item.children && !mini && (
                   <Collapse in={expandedItems.includes(item.id)} timeout={200} unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 2 }}>
                      {item.children.map((child) => (
                        <ListItemButton
                          key={child.id}
                          onClick={() => {
                            requestAnimationFrame(() => onNavClick(child.id, child.path))
                          }}
                          selected={selectedNav === child.id}
                          sx={{
                            mb: 0.5,
                            borderRadius: 2,
                            color: alpha('#ffffff', 0.8),
                            minHeight: 44,
                            '&.Mui-selected': {
                              backgroundColor: alpha('#ffffff', 0.1),
                              color: '#ffffff',
                            },
                            '&:hover': {
                              backgroundColor: alpha('#ffffff', 0.05),
                            },
                          }}
                        >
                          <ListItemIcon sx={{ 
                            color: 'inherit', 
                            minWidth: 36 
                          }}>
                            <Badge badgeContent={child.badge} color="error">
                              {child.icon}
                            </Badge>
                          </ListItemIcon>
                          <ListItemText 
                            primary={child.label}
                            primaryTypographyProps={{ 
                              fontSize: '0.8125rem',
                              fontWeight: 400
                            }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </Box>
            ))}
          </List>
        </Box>
      </Box>

      {/* ✅ FIXED: Enhanced Footer with ThemeToggle */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid rgba(255,255,255,0.1)',
        minHeight: 70
      }}>
        <Stack 
          direction={mini ? 'column' : 'row'} 
          spacing={1} 
          justifyContent="center"
        >
          <ThemeToggle variant="button" size="small" />
          <Tooltip title="Settings">
            <IconButton sx={{ color: 'inherit' }} size="small" onClick={onSettingsClick}>
              <Settings />
            </IconButton>
          </Tooltip>
          <Tooltip title="Support & Help">
            <IconButton 
              sx={{ color: 'inherit' }} 
              size="small" 
              onClick={onHelpClick}
            >
              <Support />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton 
              sx={{ color: 'inherit' }} 
              onClick={onLogout} 
              size="small"
            >
              <Logout />
            </IconButton>
          </Tooltip>
          <Tooltip title={mini ? "Expand Sidebar" : "Collapse Sidebar"}>
            <IconButton 
              sx={{ color: 'inherit' }}
              onClick={onSidebarMiniToggle}
              size="small"
            >
              {mini ? <LastPage /> : <FirstPage />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  )
}
