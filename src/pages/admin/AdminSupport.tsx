import { MessageCircle } from 'lucide-react';

export default function AdminSupport() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Support Tickets</h1>
        <p className="text-neutral-600 mt-1">Manage customer support requests</p>
      </div>

      <div className="bg-white rounded-lg border border-border p-12 text-center">
        <MessageCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h2>
        <p className="text-neutral-600">Support ticket system will be available here</p>
      </div>
    </div>
  );
}
