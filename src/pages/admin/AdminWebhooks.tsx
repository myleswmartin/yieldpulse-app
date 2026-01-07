import { Webhook } from 'lucide-react';

export default function AdminWebhooks() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Webhook Logs</h1>
        <p className="text-neutral-600 mt-1">Monitor Stripe webhook events</p>
      </div>

      <div className="bg-white rounded-lg border border-border p-12 text-center">
        <Webhook className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h2>
        <p className="text-neutral-600">Webhook monitoring will be available here</p>
      </div>
    </div>
  );
}
