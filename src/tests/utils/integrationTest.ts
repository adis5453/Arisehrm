import { supabase } from '../lib/supabase'
import RealDataService from '../services/realDataService'
import { performConnectionHealthCheck, displayHealthCheckResults } from './connectionHealthCheck'

/**
 * Quick Integration Test
 * Validates the core integration is working
 */

export async function quickIntegrationTest() {
  try {
    // Test 1: Comprehensive connection health check
    const healthResult = await performConnectionHealthCheck()

    if (healthResult.overall === 'error') {
      return false
    } else {
      }

    // Test 3: RealDataService employee directory
    try {
      const employeeResult = await RealDataService.getEmployeeDirectory({})
      } catch (empError) {
      // Continue with other tests
    }

    // Test 4: RealDataService dashboard data
    try {
      const dashboardResult = await RealDataService.getDashboardData()
      } catch (dashError) {
      // Continue with other tests
    }

    // Test 5: Database service methods
    try {
      const { default: DatabaseService } = await import('../services/databaseService')
      const profiles = await DatabaseService.getUserProfiles({})
      } catch (dbError) {
      // Continue with other tests
    }

    return true

  } catch (error) {
    return false
  }
}

// Auto-run test in development
if (import.meta.env.DEV) {
  // Run test after a brief delay to ensure modules are loaded
  setTimeout(() => {
    quickIntegrationTest().then(success => {
      if (success) {
        } else {
        }
    })
  }, 2500) // Slightly longer delay to avoid overlapping with health check
}
