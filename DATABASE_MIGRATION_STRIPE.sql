-- ================================================================
-- YieldPulse Stripe Payment Integration Migration
-- Phase 4: Premium Report Purchases
-- ================================================================

-- Create report_purchases table for immutable payment records
CREATE TABLE IF NOT EXISTS report_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id uuid NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  stripe_checkout_session_id text UNIQUE,
  stripe_payment_intent_id text,
  amount_aed integer NOT NULL DEFAULT 49,
  currency text NOT NULL DEFAULT 'aed',
  status text NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  purchased_at timestamptz,
  report_version text NOT NULL DEFAULT 'v1',
  snapshot jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_report_purchases_user_id ON report_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_report_purchases_analysis_id ON report_purchases(analysis_id);
CREATE INDEX IF NOT EXISTS idx_report_purchases_stripe_session ON report_purchases(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_report_purchases_status ON report_purchases(status);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_report_purchases_updated_at
  BEFORE UPDATE ON report_purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies
ALTER TABLE report_purchases ENABLE ROW LEVEL SECURITY;

-- Users can view their own purchases
CREATE POLICY "Users can view own purchases"
  ON report_purchases
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own purchases (via authenticated API)
CREATE POLICY "Users can create own purchases"
  ON report_purchases
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only service role can update purchases (webhook only)
CREATE POLICY "Service role can update purchases"
  ON report_purchases
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- Grant permissions
GRANT SELECT, INSERT ON report_purchases TO authenticated;
GRANT ALL ON report_purchases TO service_role;

-- ================================================================
-- Migration Notes:
-- ================================================================
-- 1. This table stores immutable snapshots of purchased reports
-- 2. Snapshots include inputs, results, and calculation version
-- 3. Status is updated only by Stripe webhook (server-side)
-- 4. One user can purchase the same analysis multiple times (edge case)
-- 5. RLS policies enforce user ownership and webhook-only updates
-- ================================================================
