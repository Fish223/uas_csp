// File: app/test-supabase/page.tsx
// Akses di http://localhost:3000/test-supabase untuk cek koneksi

import { createClient } from '@/app/supabase/server'

export default async function TestSupabasePage() {
  let connectionStatus = 'Unknown'
  let errorMessage = ''
  const envCheck = {
    hasUrl: false,
    hasKey: false,
    urlValue: '',
    keyValue: ''
  }

  try {
    // Check environment variables
    envCheck.hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    envCheck.hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    envCheck.urlValue = process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'
    envCheck.keyValue = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...' || 'NOT SET'

    // Try to create client
    const supabase = await createClient()
    
    // Test connection by fetching announcements
    const { data, error } = await supabase
      .from('announcements')
      .select('count')
      .limit(1)

    if (error) {
      connectionStatus = 'Failed'
      errorMessage = error.message
    } else {
      connectionStatus = 'Success ✅'
    }

  } catch (error: unknown) {
    connectionStatus = 'Error'
    errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🔍 Supabase Connection Test
          </h1>

          {/* Environment Variables Check */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="font-semibold text-lg text-gray-900 mb-3">
              1. Environment Variables
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                {envCheck.hasUrl ? (
                  <span className="text-green-600">✅</span>
                ) : (
                  <span className="text-red-600">❌</span>
                )}
                <span className="font-mono text-gray-700">NEXT_PUBLIC_SUPABASE_URL:</span>
                <span className="text-gray-600">{envCheck.urlValue}</span>
              </div>
              <div className="flex items-center gap-2">
                {envCheck.hasKey ? (
                  <span className="text-green-600">✅</span>
                ) : (
                  <span className="text-red-600">❌</span>
                )}
                <span className="font-mono text-gray-700">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                <span className="text-gray-600">{envCheck.keyValue}</span>
              </div>
            </div>
          </div>

          {/* Connection Status */}
          <div className={`p-4 rounded-lg border mb-6 ${
            connectionStatus.includes('Success') 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <h2 className="font-semibold text-lg text-gray-900 mb-2">
              2. Connection Status
            </h2>
            <p className="text-lg font-mono text-gray-900">{connectionStatus}</p>
            {errorMessage && (
              <div className="mt-3 p-3 bg-red-100 rounded text-sm text-red-800">
                <strong>Error:</strong> {errorMessage}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h2 className="font-semibold text-lg text-gray-900 mb-3">
              📝 Troubleshooting
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Pastikan file <code className="bg-gray-200 px-1 rounded">.env.local</code> ada di root project</li>
              <li>Restart development server setelah update .env.local</li>
              <li>Cek Supabase Dashboard - pastikan project aktif</li>
              <li>Verifikasi URL dan Key dari Settings → API di Supabase</li>
              <li>Pastikan tabel <code className="bg-gray-200 px-1 rounded">announcements</code> sudah dibuat</li>
            </ol>
          </div>

          {/* Quick Links */}
          <div className="mt-6 flex gap-4">
      
            <a 
              href="https://supabase.com/dashboard" 
              target="_blank"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Open Supabase Dashboard →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}