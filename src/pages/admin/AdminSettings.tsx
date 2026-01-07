import { Settings } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
        <p className="text-neutral-600 mt-1">Configure application settings</p>
      </div>

      <div className="bg-white rounded-lg border border-border p-12 text-center">
        <Settings className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h2>
        <p className="text-neutral-600">Settings management will be available here</p>
      </div>
    </div>
  );
}
