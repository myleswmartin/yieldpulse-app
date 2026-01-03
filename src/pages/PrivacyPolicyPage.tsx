import { Header } from '../components/Header';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 bg-gradient-to-br from-[#1e2875] to-[#2f3aad]">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 mb-4">
            <Shield className="w-10 h-10 text-white" />
            <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
          </div>
          <p className="text-lg text-white/90">
            Last updated: January 2, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-neutral max-w-none">
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 space-y-8">
              
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Introduction</h2>
                <p className="text-neutral-700 leading-relaxed">
                  YieldPulse ("we", "our", or "us") respects your privacy and is committed to protecting 
                  your personal information. This Privacy Policy explains how we collect, use, store, and 
                  protect your data when you use our UAE property investment ROI calculator service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-neutral-900 mt-6 mb-3">Account Information</h3>
                <p className="text-neutral-700 leading-relaxed mb-2">
                  When you create an account, we collect:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li>Email address</li>
                  <li>Password (encrypted and never stored in plain text)</li>
                  <li>Account creation date</li>
                </ul>

                <h3 className="text-xl font-semibold text-neutral-900 mt-6 mb-3">Property Analysis Data</h3>
                <p className="text-neutral-700 leading-relaxed mb-2">
                  When you use the calculator, we store:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li>Property details you enter (purchase price, rent, location, etc.)</li>
                  <li>Financial assumptions (mortgage terms, fees, expenses)</li>
                  <li>Calculated results and generated reports</li>
                  <li>Date and time of each analysis</li>
                </ul>

                <h3 className="text-xl font-semibold text-neutral-900 mt-6 mb-3">Payment Information</h3>
                <p className="text-neutral-700 leading-relaxed">
                  When you purchase a premium report, payment processing is handled by our secure 
                  third party payment processor. We do not store your full credit card details. 
                  We only retain transaction records including date, amount, and payment status.
                </p>

                <h3 className="text-xl font-semibold text-neutral-900 mt-6 mb-3">Usage Data</h3>
                <p className="text-neutral-700 leading-relaxed mb-2">
                  We automatically collect:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>IP address</li>
                  <li>Pages visited and features used</li>
                  <li>Time and date of visits</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">How We Use Your Information</h2>
                <p className="text-neutral-700 leading-relaxed mb-3">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li>Provide and maintain the YieldPulse service</li>
                  <li>Process your property investment calculations</li>
                  <li>Generate and deliver premium PDF reports</li>
                  <li>Manage your account and authenticate access</li>
                  <li>Process payments and maintain transaction records</li>
                  <li>Send service related emails (account confirmations, report delivery, important updates)</li>
                  <li>Improve our service and develop new features</li>
                  <li>Protect against fraud and unauthorized access</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Data Storage and Security</h2>
                <p className="text-neutral-700 leading-relaxed mb-3">
                  Your data is stored securely using industry standard practices:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li>All data is encrypted in transit using SSL/TLS</li>
                  <li>Passwords are hashed and never stored in plain text</li>
                  <li>Database access is restricted and secured with Row Level Security</li>
                  <li>We use Supabase infrastructure with enterprise grade security</li>
                  <li>Regular security updates and monitoring</li>
                </ul>
                <p className="text-neutral-700 leading-relaxed mt-3">
                  While we implement strong security measures, no method of transmission or storage 
                  is 100% secure. We cannot guarantee absolute security of your data.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Data Sharing and Disclosure</h2>
                <p className="text-neutral-700 leading-relaxed mb-3">
                  We do not sell your personal information to third parties. We may share your data only in these situations:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li><strong>Service Providers:</strong> With trusted third parties who help us operate the service 
                  (payment processors, hosting providers, email services). These providers are contractually 
                  obligated to protect your data.</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation.</li>
                  <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, 
                  your data may be transferred to the new entity.</li>
                  <li><strong>Protection of Rights:</strong> To protect our rights, property, or safety, or that of 
                  our users or the public.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Your Data Rights</h2>
                <p className="text-neutral-700 leading-relaxed mb-3">
                  You have the following rights regarding your data:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li><strong>Access:</strong> You can access all your saved analyses through your dashboard</li>
                  <li><strong>Correction:</strong> You can edit or update your analyses at any time</li>
                  <li><strong>Deletion:</strong> You can delete individual analyses from your dashboard</li>
                  <li><strong>Account Deletion:</strong> You can request complete account deletion by contacting us</li>
                  <li><strong>Data Export:</strong> You can download your premium reports as PDFs</li>
                  <li><strong>Opt Out:</strong> You can opt out of marketing emails (service emails are required)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Cookies and Tracking</h2>
                <p className="text-neutral-700 leading-relaxed mb-3">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li>Maintain your login session</li>
                  <li>Remember your preferences</li>
                  <li>Analyze how our service is used</li>
                  <li>Improve service performance</li>
                </ul>
                <p className="text-neutral-700 leading-relaxed mt-3">
                  You can control cookies through your browser settings, but disabling cookies may affect 
                  service functionality.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Data Retention</h2>
                <p className="text-neutral-700 leading-relaxed">
                  We retain your data as long as your account is active or as needed to provide services. 
                  If you delete your account, we will delete your personal information within 30 days, 
                  except where we are required to retain it for legal or regulatory purposes. Transaction 
                  records may be retained longer to comply with financial regulations.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Children's Privacy</h2>
                <p className="text-neutral-700 leading-relaxed">
                  YieldPulse is not intended for users under 18 years of age. We do not knowingly collect 
                  personal information from children. If you believe a child has provided us with personal 
                  information, please contact us and we will delete it.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">International Users</h2>
                <p className="text-neutral-700 leading-relaxed">
                  Your data may be stored and processed in any country where we or our service providers 
                  operate. By using YieldPulse, you consent to the transfer of your data to countries 
                  outside your country of residence, which may have different data protection laws.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Changes to This Policy</h2>
                <p className="text-neutral-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of significant 
                  changes by email or through a prominent notice on our service. The "Last updated" date 
                  at the top of this policy indicates when it was last revised.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Contact Us</h2>
                <p className="text-neutral-700 leading-relaxed">
                  If you have questions about this Privacy Policy or how we handle your data, please contact us at:
                </p>
                <p className="text-neutral-700 leading-relaxed mt-3">
                  Email: privacy@yieldpulse.com<br />
                  Subject: Privacy Policy Inquiry
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
