import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Lock, 
  Bell, 
  Mail, 
  Shield, 
  Zap,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '../../utils/adminApi';

interface PlatformSettings {
  // Pricing
  premiumReportPrice: number;
  currency: string;
  
  // Features
  maintenanceMode: boolean;
  allowSignups: boolean;
  requireEmailVerification: boolean;
  
  // Notifications
  adminEmailNotifications: boolean;
  userEmailNotifications: boolean;
  adminEmail: string;
  
  // Limits
  maxFreeAnalysesPerDay: number;
  maxPremiumReportsPerUser: number;
  
  // Integrations
  stripeEnabled: boolean;
  analyticsEnabled: boolean;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<PlatformSettings>({
    premiumReportPrice: 49,
    currency: 'AED',
    maintenanceMode: false,
    allowSignups: true,
    requireEmailVerification: true,
    adminEmailNotifications: true,
    userEmailNotifications: true,
    adminEmail: 'admin@yieldpulse.com',
    maxFreeAnalysesPerDay: 100,
    maxPremiumReportsPerUser: 1000,
    stripeEnabled: true,
    analyticsEnabled: true
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminApi.settings.get();
        if (data?.settings) {
          setSettings(data.settings);
          setHasChanges(false);
        }
      } catch (err: any) {
        console.error('Error loading settings:', err);
        setError(err.message || 'Failed to load settings');
        toast.error(err.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (key: keyof PlatformSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const data = await adminApi.settings.update(settings);
      if (data?.settings) {
        setSettings(data.settings);
      }
      toast.success('Settings saved successfully');
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Platform Settings</h1>
        <p className="text-neutral-600 mt-1">Configure YieldPulse platform settings and features</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-border p-6 shadow-sm text-neutral-600">
          Loading settings...
        </div>
      ) : (
        <>

      {/* Unsaved Changes Banner */}
      {hasChanges && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-medium text-amber-900">You have unsaved changes</span>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      <div className="space-y-6">
        {/* Pricing Settings */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Pricing & Currency</h2>
              <p className="text-sm text-neutral-600">Configure pricing for premium reports</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Premium Report Price
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={settings.premiumReportPrice}
                  onChange={(e) => handleChange('premiumReportPrice', parseFloat(e.target.value))}
                  className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  min="0"
                  step="1"
                />
                <select
                  value={settings.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="AED">AED</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <p className="text-xs text-neutral-500 mt-1.5">Current price per premium report</p>
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Features & Access</h2>
              <p className="text-sm text-neutral-600">Control platform features and user access</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <div>
                <p className="font-medium text-neutral-900">Maintenance Mode</p>
                <p className="text-sm text-neutral-600">Disable public access for maintenance</p>
              </div>
              <button
                onClick={() => handleChange('maintenanceMode', !settings.maintenanceMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.maintenanceMode ? 'bg-amber-500' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <div>
                <p className="font-medium text-neutral-900">Allow New Signups</p>
                <p className="text-sm text-neutral-600">Enable user registration</p>
              </div>
              <button
                onClick={() => handleChange('allowSignups', !settings.allowSignups)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.allowSignups ? 'bg-primary' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.allowSignups ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <div>
                <p className="font-medium text-neutral-900">Require Email Verification</p>
                <p className="text-sm text-neutral-600">Users must verify email before access</p>
              </div>
              <button
                onClick={() => handleChange('requireEmailVerification', !settings.requireEmailVerification)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.requireEmailVerification ? 'bg-primary' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.requireEmailVerification ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Email Notifications */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Email Notifications</h2>
              <p className="text-sm text-neutral-600">Configure email notification settings</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Admin Email Address
              </label>
              <input
                type="email"
                value={settings.adminEmail}
                onChange={(e) => handleChange('adminEmail', e.target.value)}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="admin@yieldpulse.com"
              />
              <p className="text-xs text-neutral-500 mt-1.5">Receive admin notifications at this email</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <div>
                  <p className="font-medium text-neutral-900">Admin Email Notifications</p>
                  <p className="text-sm text-neutral-600">Notify admins of new purchases and issues</p>
                </div>
                <button
                  onClick={() => handleChange('adminEmailNotifications', !settings.adminEmailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.adminEmailNotifications ? 'bg-primary' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.adminEmailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <div>
                  <p className="font-medium text-neutral-900">User Email Notifications</p>
                  <p className="text-sm text-neutral-600">Send purchase confirmations to users</p>
                </div>
                <button
                  onClick={() => handleChange('userEmailNotifications', !settings.userEmailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.userEmailNotifications ? 'bg-primary' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.userEmailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Limits */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Usage Limits</h2>
              <p className="text-sm text-neutral-600">Set platform usage limits and quotas</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Max Free Analyses Per Day (Per User)
              </label>
              <input
                type="number"
                value={settings.maxFreeAnalysesPerDay}
                onChange={(e) => handleChange('maxFreeAnalysesPerDay', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                min="0"
              />
              <p className="text-xs text-neutral-500 mt-1.5">Prevent abuse with rate limiting</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Max Premium Reports Per User
              </label>
              <input
                type="number"
                value={settings.maxPremiumReportsPerUser}
                onChange={(e) => handleChange('maxPremiumReportsPerUser', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                min="0"
              />
              <p className="text-xs text-neutral-500 mt-1.5">Maximum premium reports per account</p>
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Integrations</h2>
              <p className="text-sm text-neutral-600">Enable or disable third-party integrations</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <div>
                <p className="font-medium text-neutral-900">Stripe Payments</p>
                <p className="text-sm text-neutral-600">Accept premium report purchases</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1 text-xs text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Connected</span>
                </span>
                <button
                  onClick={() => handleChange('stripeEnabled', !settings.stripeEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.stripeEnabled ? 'bg-primary' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.stripeEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <div>
                <p className="font-medium text-neutral-900">Analytics & Tracking</p>
                <p className="text-sm text-neutral-600">Track user behavior and conversions</p>
              </div>
              <button
                onClick={() => handleChange('analyticsEnabled', !settings.analyticsEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.analyticsEnabled ? 'bg-primary' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.analyticsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
          <button
            onClick={() => {
              // Reset to initial values
              setHasChanges(false);
              toast.info('Changes discarded');
            }}
            disabled={!hasChanges}
            className="px-6 py-2.5 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Discard Changes
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
