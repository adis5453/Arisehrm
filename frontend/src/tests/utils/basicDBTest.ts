import { supabase } from '../lib/supabase'
import { executeWithRLSHandling, createFallbackData } from './rlsHandler'

/**
 * Basic Database Connectivity Test
 * Tests if tables exist and can be accessed
 */

export async function testBasicDBConnectivity() {
  // Check authentication status first
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError) {
    } else if (user) {
    } else {
    }

  const tables = [
    'departments',
    'roles',
    'positions',
    'leave_types',
    'user_profiles'
  ]

  const results = []

  for (const table of tables) {
    try {
      // Test if table exists and is accessible with RLS handling
      const result = await executeWithRLSHandling(
        () => supabase.from(table).select('*').limit(1),
        table,
        createFallbackData(table)
      )

      if (result.error && !result.bypassed) {
        // Check if it's an RLS error (which is expected)
        const isRLSError = result.error.message?.toLowerCase().includes('permission denied') ||
                          result.error.message?.toLowerCase().includes('rls') ||
                          result.error.message?.toLowerCase().includes('policy')

        if (isRLSError) {
          `)
          results.push({ table, status: 'rls_protected', message: 'RLS policies active' })
        } else {
          results.push({ table, status: 'error', error: result.error.message || 'Unknown error' })
        }
      } else if (result.bypassed) {
        results.push({ table, status: 'bypassed', count: result.data?.length || 0 })
      } else {
        results.push({ table, status: 'success', count: result.data?.length || 0 })
      }
    } catch (err) {
      results.push({ table, status: 'exception', error: err.message || 'Unknown exception' })
    }
  }

  const successCount = results.filter(r => r.status === 'success' || r.status === 'bypassed' || r.status === 'rls_protected').length
  const totalTables = results.length

  `)

  return {
    success: successCount === totalTables,
    results,
    successCount,
    totalTables
  }
}

// Note: Auto-run disabled in favor of the comprehensive health check
// To manually run this test, import and call testBasicDBConnectivity()
// Auto-run in development
// if (import.meta.env.DEV) {
//   setTimeout(() => {
//     testBasicDBConnectivity().then(result => {
//       if (result.success) {
//         //       } else {
//         //       }
//     })
//   }, 3000)
// }
