import { Shield, Database, Terminal, CheckCircle } from 'lucide-react';

export default function AdminSetupPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Admin Panel Setup</h1>
          </div>

          <div className="prose max-w-none">
            <p className="text-neutral-600 mb-6">
              To access the YieldPulse admin panel, you need to create an admin user. Follow these steps:
            </p>

            {/* Step 1 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Create a User Account</h3>
                  <p className="text-blue-800 mb-3">
                    First, sign up for a regular account at <code className="bg-blue-100 px-2 py-1 rounded">/auth/signup</code>
                  </p>
                  <a
                    href="/auth/signup"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Go to Sign Up
                  </a>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2 flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Open Supabase Dashboard
                  </h3>
                  <p className="text-purple-800 mb-3">
                    Navigate to your Supabase project dashboard and open the SQL Editor
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-purple-800 ml-4">
                    <li>Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">supabase.com/dashboard</a></li>
                    <li>Select your YieldPulse project</li>
                    <li>Click on "SQL Editor" in the left sidebar</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-900 mb-2 flex items-center">
                    <Terminal className="w-5 h-5 mr-2" />
                    Run SQL Command
                  </h3>
                  <p className="text-green-800 mb-3">
                    Execute this SQL command to grant admin access to your user:
                  </p>
                  <div className="bg-neutral-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <code>
                      UPDATE profiles<br />
                      SET is_admin = TRUE<br />
                      WHERE email = '<span className="text-yellow-400">your-email@example.com</span>';
                    </code>
                  </div>
                  <p className="text-sm text-green-700 mt-3">
                    Replace <code className="bg-green-100 px-2 py-1 rounded">your-email@example.com</code> with the email you used to sign up.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-orange-900 mb-2 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Sign In as Admin
                  </h3>
                  <p className="text-orange-800 mb-3">
                    Sign out and sign back in to refresh your permissions. You'll now have access to the admin panel.
                  </p>
                  <div className="space-y-2">
                    <a
                      href="/auth/signin"
                      className="inline-block px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 mr-3"
                    >
                      Go to Sign In
                    </a>
                    <a
                      href="/admin/dashboard"
                      className="inline-block px-4 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50"
                    >
                      Try Admin Panel
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Troubleshooting */}
            <div className="bg-neutral-100 border border-neutral-300 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Troubleshooting</h3>
              <ul className="space-y-2 text-neutral-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>If you see "Forbidden" errors, make sure you ran the SQL command with the correct email</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>After running the SQL command, sign out and sign back in to refresh your session</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>You can verify admin status by checking the <code className="bg-neutral-200 px-2 py-1 rounded">profiles</code> table in Supabase</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Make sure you've completed email verification before trying to access admin features</span>
                </li>
              </ul>
            </div>

            {/* Security Note */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Security Note</h3>
              <p className="text-red-800">
                Only grant admin access to trusted users. Admin users have full access to:
              </p>
              <ul className="mt-2 space-y-1 text-red-800 ml-6 list-disc">
                <li>View and manage all user accounts</li>
                <li>Process refunds and manual unlocks</li>
                <li>Access all purchase records and customer data</li>
                <li>View webhook logs and retry failed payments</li>
                <li>Manage support tickets and customer communications</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}