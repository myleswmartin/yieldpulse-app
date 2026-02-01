import { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Mail, Send, Building2, Clock } from 'lucide-react';
import { showToast } from '../components/Toast';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.email || !formData.subject || !formData.message) {
      showToast({ type: 'error', message: 'Please fill in all fields' });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ef294769/contact`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to send message');
      }

      showToast({
        type: 'success',
        message: 'Message sent successfully. We will respond as soon as possible.',
      });
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      showToast({ type: 'error', message: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Contact YieldPulse
            </h1>
            <p className="text-lg text-neutral-600 leading-relaxed">
              If you have a question about your analysis, need help accessing a report, or would like to understand how YieldPulse works, you can contact us using the form below.
            </p>
            <p className="text-lg text-neutral-600 leading-relaxed mt-2">
              We aim to provide clear, reliable support to all users and respond to all enquiries as quickly as possible.
            </p>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 mb-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="General Enquiry">General Enquiry</option>
                  <option value="Calculator or Report Question">Calculator or Report Question</option>
                  <option value="Premium Report Support">Premium Report Support</option>
                  <option value="Account or Access Issue">Account or Access Issue</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
                <p className="text-xs text-neutral-500 mt-3 text-center">
                  By submitting this form, you confirm that the information provided is accurate. We will only use your details to respond to your enquiry.
                </p>
              </div>
            </form>
          </div>

          {/* Support Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 mb-8">
            <div className="flex items-start gap-3 mb-4">
              <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                  Support Information
                </h2>
                <p className="text-neutral-600 leading-relaxed">
                  For most users, the fastest way to get help is by submitting the contact form above. Please include as much detail as possible, including the property or report you are referring to, so we can assist you efficiently.
                </p>
                <p className="text-neutral-600 leading-relaxed mt-3">
                  If your enquiry relates to a Premium Report, please ensure you are using the same email address associated with your account.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Business Information Section */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
              <div className="flex items-start gap-3">
                <Building2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900 mb-3">
                    Business Details
                  </h2>
                  <p className="text-neutral-600 leading-relaxed mb-3">
                    YieldPulse is operated by Constructive FZE LLC, a UAE registered company.
                  </p>
                  <p className="text-sm font-medium text-neutral-700 mb-1">
                    Business Address
                  </p>
                  <p className="text-neutral-600 text-sm leading-relaxed mb-3">
                    Business Centre, Sharjah Publishing City Free Zone<br />
                    Sharjah, United Arab Emirates
                  </p>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    This platform provides data driven property investment analysis tools for informational purposes only.
                  </p>
                </div>
              </div>
            </div>

            {/* Response Expectations Section */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900 mb-3">
                    Response Times
                  </h2>
                  <p className="text-neutral-600 leading-relaxed mb-3">
                    We aim to respond to all enquiries within one business day. During periods of high demand, response times may be slightly longer.
                  </p>
                  <p className="text-neutral-600 leading-relaxed">
                    If your enquiry is urgent and relates to access to a paid report, please state this clearly in your message subject.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="text-center">
            <p className="text-xs text-neutral-500">
              YieldPulse does not provide financial, legal, or investment advice. All responses are provided for informational support purposes only.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
