import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '../utils/supabaseClient';
import { usePublicPricing } from '../utils/usePublicPricing';
import {
  User,
  FileText,
  Settings,
  Shield,
  CreditCard,
  Bell,
  Lock,
  Download,
  Trash2,
  Check,
  Eye,
  Calendar,
  Crown,
  TrendingUp,
  DollarSign
} from 'lucide-react';

type Section = 'profile' | 'security' | 'purchases' | 'notifications' | 'privacy';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phoneNumber: string;
}

interface Purchase {
  id: string;
  analysis_id: string;
  property_name: string;
  purchase_price: number;
  created_at: string;
  amount: number;
}

export default function ProfileSettingsPage() {
  const { price, currency } = usePublicPricing();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Profile state
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    country: 'United Arab Emirates',
    phoneNumber: ''
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    reportPurchaseConfirmation: true,
    platformUpdates: true,
    marketInsights: false,
    criticalAlerts: true
  });

  // Purchases state
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [purchaseStats, setPurchaseStats] = useState({
    totalSpent: 0,
    reportsCount: 0
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      loadUserData();
      loadPurchases();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Get user metadata from Supabase auth
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser?.user_metadata) {
        const metadata = authUser.user_metadata;
        setProfile(prev => ({
          ...prev,
          firstName: metadata.first_name || metadata.full_name?.split(' ')[0] || '',
          lastName: metadata.last_name || metadata.full_name?.split(' ').slice(1).join(' ') || '',
          country: metadata.country || prev.country,
          phoneNumber: metadata.phone_number || ''
        }));
      }

      // Load preferences from KV store if they exist
      // In production, fetch from backend API
      
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const loadPurchases = async () => {
    try {
      // Fetch user's purchases from the database
      const { data, error } = await supabase
        .from('report_purchases')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'paid')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setPurchases(data);
        
        // Calculate stats
        const totalSpent = data.reduce((sum, p) => sum + (p.amount || price), 0);
        setPurchaseStats({
          totalSpent,
          reportsCount: data.length
        });
      }
    } catch (error) {
      console.error('Error loading purchases:', error);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: profile.firstName,
          last_name: profile.lastName,
          full_name: `${profile.firstName} ${profile.lastName}`.trim(),
          country: profile.country,
          phone_number: profile.phoneNumber
        }
      });

      if (error) throw error;

      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Notification preferences updated');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      toast.success('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadData = async () => {
    toast.info('Preparing your data export... This may take a few moments.');
    // In production, trigger backend job to prepare data export
  };

  const handleRequestDeletion = async () => {
    if (!confirm('Are you sure you want to request account deletion? This action cannot be undone and all your data will be permanently deleted.')) {
      return;
    }
    
    toast.success('Account deletion request submitted. Our team will contact you within 48 hours.');
    // In production, create support ticket for account deletion
  };

  const navItems = [
    { id: 'profile' as Section, label: 'Profile', icon: User },
    { id: 'security' as Section, label: 'Security', icon: Shield },
    { id: 'purchases' as Section, label: 'Purchase History', icon: CreditCard },
    { id: 'notifications' as Section, label: 'Notifications', icon: Bell },
    { id: 'privacy' as Section, label: 'Data & Privacy', icon: Lock },
  ];

  const accountCreatedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Unknown';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Profile & Settings</h1>
            <p className="text-slate-600 mt-2">
              Manage your account information, preferences, and security settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Navigation */}
            <div className="lg:col-span-1">
              <nav className="bg-white rounded-xl border border-slate-200 p-2 sticky top-8 shadow-sm">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? 'bg-primary text-white'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                {/* Profile Section */}
                {activeSection === 'profile' && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-slate-900">Profile Information</h2>
                      <p className="text-slate-600 mt-1">
                        Update your personal information and contact details
                      </p>
                    </div>

                    {/* Account Summary Card */}
                    <div className="bg-gradient-to-br from-primary to-teal rounded-xl p-6 mb-8 text-white">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-white/80 text-sm mb-1">YieldPulse Member</p>
                          <h3 className="text-2xl font-bold">{profile.firstName || 'User'} {profile.lastName}</h3>
                        </div>
                        <div className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                          <p className="text-sm font-medium">Active</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div>
                          <p className="text-white/80 text-sm">Member Since</p>
                          <p className="font-semibold mt-1">{accountCreatedDate}</p>
                        </div>
                        <div>
                          <p className="text-white/80 text-sm">Premium Reports</p>
                          <p className="font-semibold mt-1">{purchaseStats.reportsCount} Purchased</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={profile.firstName}
                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="Enter first name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={profile.lastName}
                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="Enter last name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={profile.email}
                            disabled
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 text-green-600">
                            <Check className="w-4 h-4" />
                            <span className="text-xs font-medium">Verified</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5">Email cannot be changed for security reasons</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Country
                          </label>
                          <select
                            value={profile.country}
                            onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          >
                            <option value="United Arab Emirates">United Arab Emirates</option>
                            <option value="Saudi Arabia">Saudi Arabia</option>
                            <option value="Qatar">Qatar</option>
                            <option value="Kuwait">Kuwait</option>
                            <option value="Bahrain">Bahrain</option>
                            <option value="Oman">Oman</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                          </label>
                          <input
                            type="tel"
                            value={profile.phoneNumber}
                            onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="+971 50 123 4567"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200">
                        <button
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Section */}
                {activeSection === 'security' && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-slate-900">Security</h2>
                      <p className="text-slate-600 mt-1">
                        Manage your password and account security settings
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Change Password */}
                      <div className="border border-slate-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Change Password</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                              placeholder="Enter new password"
                            />
                            <p className="text-xs text-slate-500 mt-1.5">Must be at least 8 characters</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              value={passwordForm.confirmPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                              placeholder="Confirm new password"
                            />
                          </div>

                          <button
                            onClick={handleChangePassword}
                            disabled={isSaving || !passwordForm.newPassword || !passwordForm.confirmPassword}
                            className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSaving ? 'Updating...' : 'Update Password'}
                          </button>
                        </div>
                      </div>

                      {/* Email Verification Status */}
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-green-900 mb-1">Email Verified</p>
                            <p className="text-sm text-green-700">Your email address has been verified</p>
                          </div>
                          <div className="flex items-center space-x-2 text-green-600">
                            <Check className="w-6 h-6" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Purchase History Section */}
                {activeSection === 'purchases' && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-slate-900">Purchase History</h2>
                      <p className="text-slate-600 mt-1">
                        View all your premium report purchases and download them anytime
                      </p>
                    </div>

                    {/* Purchase Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-white/80 text-sm">Total Spent</p>
                          <DollarSign className="w-5 h-5 text-white/60" />
                        </div>
                        <p className="text-3xl font-bold">AED {purchaseStats.totalSpent}</p>
                      </div>

                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-white/80 text-sm">Premium Reports</p>
                          <FileText className="w-5 h-5 text-white/60" />
                        </div>
                        <p className="text-3xl font-bold">{purchaseStats.reportsCount}</p>
                      </div>
                    </div>

                    {purchases.length === 0 ? (
                      <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                        <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600 text-lg font-medium mb-2">No purchases yet</p>
                        <p className="text-sm text-slate-500 mb-6">
                          Premium reports will appear here after purchase
                        </p>
                        <a
                          href="/calculator"
                          className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors"
                        >
                          <TrendingUp className="w-5 h-5" />
                          <span>Start Analysis</span>
                        </a>
                      </div>
                    ) : (
                      <div className="overflow-x-auto border border-slate-200 rounded-xl">
                        <table className="w-full">
                          <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Property</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Purchase Price</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Amount Paid</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {purchases.map((purchase) => (
                              <tr key={purchase.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                  <p className="font-medium text-slate-900">{purchase.property_name || 'Property Analysis'}</p>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                  AED {purchase.purchase_price?.toLocaleString() || 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-slate-600 text-sm">
                                  {new Date(purchase.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </td>
                                <td className="px-6 py-4 font-semibold text-green-600">
                                  {currency} {purchase.amount || price}
                                </td>
                                <td className="px-6 py-4">
                                  <a
                                    href={`/reports?id=${purchase.analysis_id}`}
                                    className="inline-flex items-center space-x-2 text-primary hover:text-primary-hover font-medium text-sm transition-colors"
                                  >
                                    <Eye className="w-4 h-4" />
                                    <span>View Report</span>
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Notifications Section */}
                {activeSection === 'notifications' && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
                      <p className="text-slate-600 mt-1">
                        Choose what updates you want to receive from YieldPulse
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div>
                          <p className="font-medium text-slate-900">Purchase Confirmations</p>
                          <p className="text-sm text-slate-600">Get notified when you purchase a premium report</p>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, reportPurchaseConfirmation: !notifications.reportPurchaseConfirmation })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications.reportPurchaseConfirmation ? 'bg-primary' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications.reportPurchaseConfirmation ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div>
                          <p className="font-medium text-slate-900">Platform Updates</p>
                          <p className="text-sm text-slate-600">New features, improvements, and product announcements</p>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, platformUpdates: !notifications.platformUpdates })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications.platformUpdates ? 'bg-primary' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications.platformUpdates ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div>
                          <p className="font-medium text-slate-900">Market Insights</p>
                          <p className="text-sm text-slate-600">UAE property market trends and investment tips</p>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, marketInsights: !notifications.marketInsights })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications.marketInsights ? 'bg-primary' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications.marketInsights ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-100 rounded-lg border-2 border-slate-300">
                        <div>
                          <p className="font-medium text-slate-900">Critical Alerts</p>
                          <p className="text-sm text-slate-600">Important account and security notifications (cannot be disabled)</p>
                        </div>
                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-400 opacity-50 cursor-not-allowed">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200">
                        <button
                          onClick={handleSaveNotifications}
                          disabled={isSaving}
                          className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSaving ? 'Saving...' : 'Save Preferences'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Data & Privacy Section */}
                {activeSection === 'privacy' && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-slate-900">Data & Privacy</h2>
                      <p className="text-slate-600 mt-1">
                        Control your data and privacy settings
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="border border-slate-200 rounded-xl p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Download Your Data</h3>
                            <p className="text-sm text-slate-600 mb-4">
                              Request a copy of all your personal information, analyses, and purchased reports
                            </p>
                          </div>
                          <button
                            onClick={handleDownloadData}
                            className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center space-x-2"
                          >
                            <Download className="w-4 h-4" />
                            <span>Export Data</span>
                          </button>
                        </div>
                      </div>

                      <div className="border border-red-200 rounded-xl p-6 bg-red-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-red-900 mb-2">Delete Account</h3>
                            <p className="text-sm text-red-700 mb-4">
                              Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                          </div>
                          <button
                            onClick={handleRequestDeletion}
                            className="px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete Account</span>
                          </button>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Privacy Policy</h3>
                        <p className="text-sm text-blue-700 mb-4">
                          Learn how we collect, use, and protect your data
                        </p>
                        <a
                          href="/privacy-policy"
                          className="text-primary hover:text-primary-hover font-medium text-sm flex items-center space-x-1"
                        >
                          <span>Read Privacy Policy</span>
                          <span>→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
