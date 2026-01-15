import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          {/* Page Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold text-neutral-900">
                Privacy Policy
              </h1>
            </div>
            <p className="text-sm text-neutral-600">
              Effective Date: 09 January 2026
            </p>
            <p className="text-sm text-neutral-600 mt-1">
              Last Updated: 09 January 2026
            </p>
          </div>

          {/* Section 1 - Introduction */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              1. Introduction
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                This Privacy Policy ("Policy") explains how YieldPulse ("we", "us", "our", or "the Platform") collects, uses, processes, stores, shares, and protects personal information from users ("you", "your", or "User") of our property investment analysis platform and associated services.
              </p>
              <p>
                YieldPulse is committed to protecting your privacy and handling your personal data in accordance with applicable data protection laws, including but not limited to the UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data and other relevant regulations.
              </p>
              <p>
                By accessing or using YieldPulse, you acknowledge that you have read, understood, and consent to the practices described in this Privacy Policy. If you do not agree with this Policy, you must immediately cease using the Platform.
              </p>
              <p className="font-medium text-neutral-700">
                This Policy applies to all users of YieldPulse, including free users and those who purchase premium reports.
              </p>
            </div>
          </section>

          {/* Section 2 - Information We Collect */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              2. Information We Collect
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                We collect various types of information to provide, maintain, and improve our services:
              </p>
              
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-neutral-800 mb-3 mt-6">
                  2.1 Information You Provide Directly
                </h3>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span><strong>Account Information:</strong> Email address, password (encrypted), first name, last name, country of residence, preferred currency, and timezone when you create an account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span><strong>Property Data Inputs:</strong> Property purchase price, rental income, financing details, expenses, property names, locations, and other investment parameters you enter into the calculator</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span><strong>Payment Information:</strong> Payment card details processed securely through Stripe (we do not store full card details on our servers)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span><strong>Communications:</strong> Messages, inquiries, and support requests submitted through contact forms or email correspondence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span><strong>User Preferences:</strong> Report settings, notification preferences, dashboard configurations, and other customization choices</span>
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-neutral-800 mb-3 mt-6">
                  2.2 Information Collected Automatically
                </h3>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span><strong>Usage Data:</strong> Pages visited, features used, time spent on platform, navigation paths, button clicks, and interaction patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span><strong>Device Information:</strong> IP address, browser type and version, operating system, device type, screen resolution, and language settings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span><strong>Log Data:</strong> Server logs including access times, error reports, API requests, and system performance metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span><strong>Cookies and Similar Technologies:</strong> Session identifiers, authentication tokens, preference cookies, and analytics cookies (see Section 9 for details)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span><strong>Referral Information:</strong> Source of traffic (search engines, social media, direct links), campaign identifiers, and UTM parameters</span>
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-neutral-800 mb-3 mt-6">
                  2.3 Information from Third Parties
                </h3>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span><strong>Payment Processors:</strong> Transaction confirmation, payment status, and fraud detection data from Stripe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span><strong>Authentication Services:</strong> Verification status and session management data from Supabase Auth</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span><strong>Analytics Providers:</strong> Aggregated usage statistics and performance metrics (if applicable)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 - How We Use Your Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              3. How We Use Your Information
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                We use the collected information for the following lawful purposes:
              </p>
              
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-neutral-800 mb-3 mt-6">
                  3.1 Service Provision and Operation
                </h3>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Create, maintain, and authenticate user accounts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Generate investment analysis reports and financial projections based on your inputs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Store and display your saved property analyses in your dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Process payments for premium reports and maintain transaction records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Generate and deliver PDF reports to authorized users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Enable property comparison functionality across multiple analyses</span>
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-neutral-800 mb-3 mt-6">
                  3.2 Communication and Support
                </h3>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Respond to inquiries, support requests, and technical issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Send transactional emails (purchase confirmations, password resets, account notifications)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Notify users of report availability and system updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Send critical service announcements and security alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Provide platform updates and feature announcements (with consent)</span>
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-neutral-800 mb-3 mt-6">
                  3.3 Platform Improvement and Analytics
                </h3>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Analyze usage patterns to improve user experience and platform functionality</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Monitor system performance, identify bugs, and optimize infrastructure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Develop new features and enhance existing calculation methodologies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Conduct aggregate analysis of user behavior (anonymized where possible)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Test and validate calculation accuracy and report generation</span>
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-neutral-800 mb-3 mt-6">
                  3.4 Security and Fraud Prevention
                </h3>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Detect, prevent, and investigate fraudulent transactions and unauthorized access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Monitor for security threats, abuse, and violations of Terms of Service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Verify user identity and maintain account security</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Maintain audit logs for security and compliance purposes</span>
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-neutral-800 mb-3 mt-6">
                  3.5 Legal Compliance
                </h3>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Comply with applicable laws, regulations, and legal obligations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Respond to lawful requests from government authorities and law enforcement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Maintain financial records as required by UAE commercial regulations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Enforce our Terms of Service and protect our legal rights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Resolve disputes and defend against legal claims</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4 - Legal Basis for Processing */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              4. Legal Basis for Processing
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                We process your personal data based on the following legal grounds:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Contractual Necessity:</strong> Processing is necessary to perform our contract with you (Terms of Service) and provide the services you request</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Consent:</strong> You have given explicit consent for specific processing activities, such as marketing communications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Legitimate Interests:</strong> Processing is necessary for our legitimate business interests (platform improvement, fraud prevention, analytics) that do not override your fundamental rights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Legal Obligations:</strong> Processing is required to comply with applicable laws and regulations</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5 - Data Sharing and Disclosure */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              5. Data Sharing and Disclosure
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p className="font-medium text-neutral-700">
                We do not sell, rent, or trade your personal data to third parties for marketing purposes.
              </p>
              <p>
                We may share your information with the following categories of recipients:
              </p>
              
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-neutral-800 mb-3 mt-6">
                  5.1 Service Providers and Business Partners
                </h3>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span><strong>Payment Processing:</strong> Stripe Inc. processes payment transactions securely on our behalf</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span><strong>Cloud Infrastructure:</strong> Supabase (hosting, database, authentication services) stores data on secure cloud servers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span><strong>Email Services:</strong> Transactional email providers deliver account notifications and reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span><strong>Analytics Services:</strong> Third-party analytics tools help us understand platform usage (data anonymized where possible)</span>
                  </li>
                </ul>
                <p className="mt-3">
                  All service providers are contractually obligated to maintain data confidentiality and use information solely for providing services to YieldPulse.
                </p>

                <h3 className="text-xl font-semibold text-neutral-800 mb-3 mt-6">
                  5.2 Legal and Regulatory Requirements
                </h3>
                <p>
                  We may disclose your information when required by law or in response to:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Valid legal processes (court orders, subpoenas, warrants)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Government investigations or regulatory inquiries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Requests from law enforcement or public authorities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>Circumstances involving potential threats to public safety or legal rights</span>
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-neutral-800 mb-3 mt-6">
                  5.3 Business Transfers
                </h3>
                <p>
                  In the event of a merger, acquisition, reorganization, sale of assets, or bankruptcy, your personal data may be transferred to successor entities or acquiring parties, subject to the same privacy protections outlined in this Policy.
                </p>

                <h3 className="text-xl font-semibold text-neutral-800 mb-3 mt-6">
                  5.4 Aggregated and Anonymized Data
                </h3>
                <p>
                  We may share aggregated, anonymized data that cannot identify individual users for industry research, market analysis, or public reporting purposes.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 - Data Security */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              6. Data Security
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                We implement industry-standard technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
              </p>
              
              <h3 className="text-xl font-semibold text-neutral-800 mb-3 mt-6">
                6.1 Security Measures Include
              </h3>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Encryption:</strong> Data transmission secured via TLS/SSL encryption; passwords hashed using industry-standard algorithms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Access Controls:</strong> Role-based access restrictions, multi-factor authentication options, and session management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Infrastructure Security:</strong> Secure cloud hosting with regular security patches and updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Monitoring:</strong> Continuous security monitoring, intrusion detection, and audit logging</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Data Backups:</strong> Regular automated backups stored in geographically distributed locations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Employee Training:</strong> Staff trained on data protection best practices and confidentiality obligations</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-neutral-800 mb-3 mt-6">
                6.2 Limitations
              </h3>
              <p>
                While we employ robust security measures, no system is completely secure. We cannot guarantee absolute security of data transmitted over the Internet or stored electronically. You acknowledge and accept the inherent risks of online data transmission.
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and must notify us immediately of any unauthorized access or security breaches.
              </p>
            </div>
          </section>

          {/* Section 7 - Data Retention */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              7. Data Retention
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                We retain personal data for as long as necessary to fulfill the purposes outlined in this Policy, unless a longer retention period is required or permitted by law.
              </p>
              
              <h3 className="text-xl font-semibold text-neutral-800 mb-3 mt-6">
                7.1 Retention Periods
              </h3>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Account Data:</strong> Retained while your account is active and for a reasonable period after deletion to comply with legal obligations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Property Analyses:</strong> Stored indefinitely in your dashboard unless you delete them; retained for 90 days after account deletion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Transaction Records:</strong> Maintained for minimum 7 years to comply with UAE financial record-keeping requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Communications:</strong> Support tickets and correspondence retained for 3 years for quality assurance and dispute resolution</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Log Data:</strong> Server logs and usage analytics retained for 12-24 months for security and optimization purposes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Marketing Consents:</strong> Maintained until you withdraw consent or request deletion</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-neutral-800 mb-3 mt-6">
                7.2 Deletion Process
              </h3>
              <p>
                When data is no longer required, we securely delete or anonymize it using industry-standard data destruction methods. Some residual copies may remain in backup systems for a limited period but will be isolated and eventually purged.
              </p>
            </div>
          </section>

          {/* Section 8 - Your Privacy Rights */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              8. Your Privacy Rights
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                Under applicable data protection laws, you have the following rights regarding your personal data:
              </p>
              
              <ul className="space-y-3 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <div>
                    <strong>Right to Access:</strong> Request a copy of the personal data we hold about you, including processing details
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <div>
                    <strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete personal data
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <div>
                    <strong>Right to Erasure (Right to be Forgotten):</strong> Request deletion of your personal data, subject to legal retention obligations
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <div>
                    <strong>Right to Restriction:</strong> Request limitation of processing activities in certain circumstances
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <div>
                    <strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format and transfer it to another service provider
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <div>
                    <strong>Right to Object:</strong> Object to processing based on legitimate interests or for direct marketing purposes
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <div>
                    <strong>Right to Withdraw Consent:</strong> Withdraw previously given consent at any time (does not affect lawfulness of prior processing)
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <div>
                    <strong>Right to Lodge a Complaint:</strong> File a complaint with the UAE Data Office or relevant supervisory authority if you believe your rights have been violated
                  </div>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-neutral-800 mb-3 mt-6">
                8.1 Exercising Your Rights
              </h3>
              <p>
                To exercise any of these rights, you may:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Use the data export and deletion tools in your Profile & Settings section</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Contact us via the Contact page or email us directly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Submit a written request with proof of identity</span>
                </li>
              </ul>
              <p className="mt-4">
                We will respond to your request within 30 days. In complex cases, we may extend this period by an additional 30 days and will notify you of the extension.
              </p>
              <p>
                Certain requests may be declined if they are unfounded, excessive, or would adversely affect the rights of others, or if we are legally required to retain the data.
              </p>
            </div>
          </section>

          {/* Section 9 - Cookies and Tracking Technologies */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              9. Cookies and Tracking Technologies
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                YieldPulse uses cookies and similar tracking technologies to enhance user experience, maintain sessions, and analyze platform usage.
              </p>
              
              <h3 className="text-xl font-semibold text-neutral-800 mb-3 mt-6">
                9.1 Types of Cookies We Use
              </h3>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <div>
                    <strong>Essential Cookies:</strong> Required for platform functionality, authentication, and security. Cannot be disabled.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <div>
                    <strong>Functional Cookies:</strong> Remember your preferences, settings, and previous interactions
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <div>
                    <strong>Analytics Cookies:</strong> Help us understand how users interact with the platform (can be disabled)
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <div>
                    <strong>Performance Cookies:</strong> Monitor system performance and identify technical issues
                  </div>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-neutral-800 mb-3 mt-6">
                9.2 Managing Cookies
              </h3>
              <p>
                You can control and manage cookies through your browser settings. Disabling essential cookies may impair platform functionality. Most browsers allow you to:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>View and delete existing cookies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Block third-party cookies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Block all cookies from specific websites</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Clear all cookies when closing the browser</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 10 - International Data Transfers */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              10. International Data Transfers
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                Your personal data may be transferred to and processed in countries outside the United Arab Emirates, including countries that may not provide the same level of data protection as UAE law.
              </p>
              <p>
                When we transfer data internationally, we ensure appropriate safeguards are in place, including:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Contractual clauses with service providers requiring equivalent data protection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Processing data only with providers in jurisdictions recognized as providing adequate protection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Encryption and security measures during transmission and storage</span>
                </li>
              </ul>
              <p>
                By using YieldPulse, you consent to the transfer of your data as described in this Policy.
              </p>
            </div>
          </section>

          {/* Section 11 - Children's Privacy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              11. Children's Privacy
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                YieldPulse is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from minors.
              </p>
              <p>
                If we become aware that we have collected personal data from a child under 18 without proper parental consent, we will take immediate steps to delete that information.
              </p>
              <p>
                If you believe we have inadvertently collected data from a minor, please contact us immediately.
              </p>
            </div>
          </section>

          {/* Section 12 - Third-Party Links */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              12. Third-Party Links and Services
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                YieldPulse may contain links to third-party websites, services, or resources. This Privacy Policy applies only to YieldPulse and not to any external sites.
              </p>
              <p>
                We are not responsible for the privacy practices or content of third-party websites. We encourage you to review the privacy policies of any external sites you visit.
              </p>
              <p>
                The inclusion of third-party links does not imply endorsement or affiliation.
              </p>
            </div>
          </section>

          {/* Section 13 - Changes to This Policy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              13. Changes to This Privacy Policy
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                We reserve the right to modify this Privacy Policy at any time to reflect changes in our practices, technology, legal requirements, or business operations.
              </p>
              <p>
                When we make material changes, we will:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Update the "Effective Date" and "Last Updated" at the top of this Policy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Notify you via email or prominent platform notice</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Provide you with an opportunity to review the changes before they take effect</span>
                </li>
              </ul>
              <p>
                Your continued use of YieldPulse after the effective date of changes constitutes acceptance of the revised Policy. If you do not agree to the changes, you must stop using the platform and may request account deletion.
              </p>
              <p>
                We recommend reviewing this Policy periodically to stay informed about how we protect your data.
              </p>
            </div>
          </section>

          {/* Section 14 - Contact Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              14. Contact Information
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
                <p className="font-medium text-neutral-900 mb-2">YieldPulse Data Protection</p>
                <p>Via the Contact page on our website</p>
                <p className="mt-4 text-sm">
                  We will respond to all legitimate requests within 30 days.
                </p>
              </div>
            </div>
          </section>

          {/* Section 15 - Governing Law */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              15. Governing Law and Jurisdiction
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                This Privacy Policy is governed by and construed in accordance with the laws of the United Arab Emirates, including UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data.
              </p>
              <p>
                Any disputes arising from this Policy or our data practices shall be subject to the exclusive jurisdiction of the courts of the United Arab Emirates.
              </p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="mb-10">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <p className="text-neutral-700 leading-relaxed">
                <strong>Acknowledgment:</strong> By using YieldPulse, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. You consent to the collection, use, and disclosure of your personal data as described herein.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
