import { createClient } from '../supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '../action/auth'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Fetch announcements
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome, <span className="font-semibold text-indigo-600">{user.email}</span>
              </p>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold"
              >
                Logout
              </button>
            </form>
          </div>
        </div>

        {/* Announcements */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pengumuman</h2>
          <div className="space-y-4">
            {announcements && announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {announcement.content}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(announcement.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                Belum ada pengumuman
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
