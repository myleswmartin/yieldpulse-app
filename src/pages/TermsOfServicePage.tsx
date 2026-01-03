import { Header } from '../components/Header';
import { FileText } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 bg-gradient-to-br from-[#1e2875] to-[#2f3aad]">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 mb-4">
            <FileText className="w-10 h-10 text-white" />
            <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
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
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Agreement to Terms</h2>
                <p className="text-neutral-700 leading-relaxed">
                  By accessing or using YieldPulse (the "Service"), you agree to be bound by these Terms of Service 
                  ("Terms"). If you do not agree to these Terms, you may not use the Service. These Terms apply to 
                  all users, including visitors, registered users, and paying customers.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Description of Service</h2>
                <p className="text-neutral-700 leading-relaxed mb-3">
                  YieldPulse is a web based property investment ROI calculator designed specifically for the UAE market. 
                  The Service provides:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li>Free calculation of headline investment metrics (gross yield, net yield, cash flow, cash on cash return)</li>
                  <li>Paid premium reports with detailed 5 year projections, sensitivity analysis, and exit strategies</li>
                  <li>User accounts to save and access previous analyses</li>
                  <li>Downloadable PDF reports for purchased analyses</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Account Registration</h2>
                <p className="text-neutral-700 leading-relaxed mb-3">
                  To use certain features, you must create an account. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your password</li>
                  <li>Notify us immediately of any unauthorized account access</li>
                  <li>Be responsible for all activities under your account</li>
                  <li>Not share your account with others</li>
                  <li>Be at least 18 years of age</li>
                </ul>
                <p className="text-neutral-700 leading-relaxed mt-3">
                  We reserve the right to suspend or terminate accounts that violate these Terms.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Pricing and Payments</h2>
                
                <h3 className="text-xl font-semibold text-neutral-900 mt-6 mb-3">Free Services</h3>
                <p className="text-neutral-700 leading-relaxed">
                  Basic calculator features and headline metrics are provided free of charge. We may modify 
                  or discontinue free features at any time.
                </p>

                <h3 className="text-xl font-semibold text-neutral-900 mt-6 mb-3">Premium Reports</h3>
                <p className="text-neutral-700 leading-relaxed mb-2">
                  Premium PDF reports are available for purchase at AED 49 per report. By purchasing:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li>You authorize us to charge the stated amount</li>
                  <li>Payment is processed immediately</li>
                  <li>You receive instant access to download the report</li>
                  <li>The report remains accessible in your dashboard indefinitely</li>
                  <li>Prices are subject to change, but existing purchases are honored at original price</li>
                </ul>

                <h3 className="text-xl font-semibold text-neutral-900 mt-6 mb-3">Refund Policy</h3>
                <p className="text-neutral-700 leading-relaxed">
                  Because premium reports are digital products delivered instantly, all sales are final. 
                  We do not offer refunds except in cases of technical error that prevents report delivery. 
                  We encourage you to use the free features extensively before purchasing.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">User Responsibilities</h2>
                <p className="text-neutral-700 leading-relaxed mb-3">
                  You agree to use the Service responsibly and:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li>Provide accurate property and financial information</li>
                  <li>Use calculations and reports for lawful purposes only</li>
                  <li>Not attempt to reverse engineer or copy the Service</li>
                  <li>Not use automated tools to scrape or extract data</li>
                  <li>Not share purchased reports publicly or redistribute them commercially</li>
                  <li>Not attempt to access other users' data or accounts</li>
                  <li>Not upload malicious code or attempt to compromise security</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Intellectual Property</h2>
                <p className="text-neutral-700 leading-relaxed mb-3">
                  The Service, including all content, features, functionality, code, design, and trademarks, 
                  is owned by YieldPulse and protected by intellectual property laws. You are granted a limited, 
                  non exclusive, non transferable license to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li>Access and use the Service for personal or business property investment analysis</li>
                  <li>Download and use purchased reports for your own purposes</li>
                  <li>Share reports with relevant stakeholders (partners, advisors, lenders) in the context of 
                  specific property investment decisions</li>
                </ul>
                <p className="text-neutral-700 leading-relaxed mt-3">
                  You may not copy, modify, distribute, sell, or create derivative works from the Service 
                  or its content without our written permission.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Disclaimer of Warranties</h2>
                <p className="text-neutral-700 leading-relaxed mb-3 uppercase font-semibold">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.
                </p>
                <p className="text-neutral-700 leading-relaxed mb-3">
                  We do not warrant that:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li>The Service will be uninterrupted, timely, secure, or error free</li>
                  <li>Results will be accurate, reliable, or complete</li>
                  <li>The Service will meet your specific requirements</li>
                  <li>Any errors will be corrected</li>
                  <li>The Service is free from viruses or harmful components</li>
                </ul>
                <p className="text-neutral-700 leading-relaxed mt-3">
                  Your use of the Service is at your own risk. You are solely responsible for any decisions 
                  made based on calculations or reports from the Service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Limitation of Liability</h2>
                <p className="text-neutral-700 leading-relaxed mb-3 uppercase font-semibold">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, YIELDPULSE SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                  INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
                </p>
                <p className="text-neutral-700 leading-relaxed mb-3">
                  This includes but is not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li>Lost profits or investment losses</li>
                  <li>Business interruption</li>
                  <li>Loss of data or information</li>
                  <li>Cost of substitute services</li>
                  <li>Decisions made based on our calculations</li>
                </ul>
                <p className="text-neutral-700 leading-relaxed mt-3">
                  Our total liability to you for any claim arising from or related to the Service shall not 
                  exceed the amount you paid us in the 12 months prior to the claim, or AED 100, whichever is greater.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Indemnification</h2>
                <p className="text-neutral-700 leading-relaxed">
                  You agree to indemnify and hold harmless YieldPulse, its officers, employees, and agents from 
                  any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4 mt-3">
                  <li>Your use of the Service</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any rights of others</li>
                  <li>Investment decisions made using our Service</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Data and Privacy</h2>
                <p className="text-neutral-700 leading-relaxed">
                  Your use of the Service is also governed by our Privacy Policy. By using the Service, you 
                  consent to our collection and use of data as described in the Privacy Policy. You own the 
                  property and financial data you enter, but grant us a license to use it to provide the Service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Termination</h2>
                <p className="text-neutral-700 leading-relaxed mb-3">
                  We may suspend or terminate your access to the Service:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li>For violation of these Terms</li>
                  <li>For fraudulent or illegal activity</li>
                  <li>If required by law</li>
                  <li>At our discretion for business reasons</li>
                </ul>
                <p className="text-neutral-700 leading-relaxed mt-3">
                  You may terminate your account at any time by contacting us. Upon termination, your access 
                  to saved analyses and purchased reports will be removed, though we may retain certain data 
                  as required by law or for legitimate business purposes.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Changes to Service and Terms</h2>
                <p className="text-neutral-700 leading-relaxed">
                  We reserve the right to modify or discontinue the Service at any time. We may update these 
                  Terms periodically. Continued use of the Service after changes constitutes acceptance of the 
                  new Terms. We will notify users of material changes via email or Service notification.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Governing Law</h2>
                <p className="text-neutral-700 leading-relaxed">
                  These Terms are governed by the laws of the United Arab Emirates. Any disputes shall be 
                  resolved in the courts of Dubai, UAE. If any provision of these Terms is found invalid, 
                  the remaining provisions remain in full effect.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Entire Agreement</h2>
                <p className="text-neutral-700 leading-relaxed">
                  These Terms, together with our Privacy Policy and Disclaimer, constitute the entire agreement 
                  between you and YieldPulse regarding the Service. They supersede any prior agreements or 
                  understandings.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Contact</h2>
                <p className="text-neutral-700 leading-relaxed">
                  Questions about these Terms should be directed to:
                </p>
                <p className="text-neutral-700 leading-relaxed mt-3">
                  Email: legal@yieldpulse.com<br />
                  Subject: Terms of Service Inquiry
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
