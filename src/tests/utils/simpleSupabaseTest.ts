/**
 * Simple test to verify Supabase connectivity
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export async function testSupabaseConnectivity() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return false
  }

  try {
    // Test basic REST endpoint
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      return true
    } else {
      return false
    }
    
  } catch (error) {
    return false
  }
}

// Auto-run
if (import.meta.env.DEV) {
  setTimeout(testSupabaseConnectivity, 500)
}

export default testSupabaseConnectivity
