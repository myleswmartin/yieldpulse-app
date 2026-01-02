-- YieldPulse Database Schema
-- Execute these SQL statements in your Supabase SQL Editor
-- ================================================================

-- ================================================================
-- 1. PROFILES TABLE
-- ================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running script)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ================================================================
-- 2. ANALYSES TABLE
-- ================================================================

CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Property Details
  property_name TEXT,
  listing_url TEXT,
  portal_source TEXT CHECK (portal_source IN ('Bayut', 'Property Finder', 'Dubizzle', 'Other')),
  property_type TEXT CHECK (property_type IN ('Apartment', 'Villa', 'Townhouse', 'Penthouse')),
  location TEXT,
  area_sqft NUMERIC(10,2) NOT NULL CHECK (area_sqft >= 100 AND area_sqft <= 50000),
  
  -- Financial Inputs
  purchase_price NUMERIC(12,2) NOT NULL CHECK (purchase_price >= 100000),
  down_payment_percent NUMERIC(5,2) NOT NULL CHECK (down_payment_percent >= 15 AND down_payment_percent <= 100),
  mortgage_interest_rate NUMERIC(5,2) NOT NULL,
  mortgage_term_years INTEGER NOT NULL CHECK (mortgage_term_years >= 5 AND mortgage_term_years <= 30),
  expected_monthly_rent NUMERIC(10,2) NOT NULL CHECK (expected_monthly_rent >= 1000),
  service_charge_annual NUMERIC(10,2) DEFAULT 0,
  annual_maintenance_percent NUMERIC(5,2) DEFAULT 1,
  property_management_fee_percent NUMERIC(5,2) DEFAULT 5,
  dld_fee_percent NUMERIC(5,2) DEFAULT 4,
  agent_fee_percent NUMERIC(5,2) DEFAULT 2,
  
  -- Projection Parameters
  capital_growth_percent NUMERIC(5,2) DEFAULT 3,
  rent_growth_percent NUMERIC(5,2) DEFAULT 2,
  vacancy_rate_percent NUMERIC(5,2) DEFAULT 5,
  holding_period_years INTEGER DEFAULT 5 CHECK (holding_period_years >= 1 AND holding_period_years <= 30),
  
  -- Calculated Results (stored for quick access)
  gross_yield NUMERIC(5,2),
  net_yield NUMERIC(5,2),
  monthly_cash_flow NUMERIC(10,2),
  annual_cash_flow NUMERIC(10,2),
  cash_on_cash_return NUMERIC(5,2),
  
  -- Complete calculation results (JSONB for flexibility)
  calculation_results JSONB,
  
  -- Metadata
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_is_paid ON analyses(is_paid);

-- Enable RLS
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can insert own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can update own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can delete own analyses" ON analyses;
DROP POLICY IF EXISTS "Admins can view all analyses" ON analyses;
DROP POLICY IF EXISTS "Admins can update all analyses" ON analyses;

-- RLS Policies for analyses
CREATE POLICY "Users can view own analyses"
  ON analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses"
  ON analyses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON analyses FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all analyses"
  ON analyses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can update all analyses"
  ON analyses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ================================================================
-- 3. PAYMENTS TABLE
-- ================================================================

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  
  amount_aed NUMERIC(10,2) NOT NULL DEFAULT 49.00,
  payment_status TEXT DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT DEFAULT 'simulated',
  transaction_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(analysis_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_analysis_id ON payments(analysis_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Users can insert own payments" ON payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;

-- RLS Policies for payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ================================================================
-- 4. REPORT FILES TABLE
-- ================================================================

CREATE TABLE IF NOT EXISTS report_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size_bytes INTEGER,
  storage_bucket TEXT DEFAULT 'make-ef294769-reports',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(analysis_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_report_files_user_id ON report_files(user_id);
CREATE INDEX IF NOT EXISTS idx_report_files_analysis_id ON report_files(analysis_id);

-- Enable RLS
ALTER TABLE report_files ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own report files" ON report_files;
DROP POLICY IF EXISTS "Users can insert own report files" ON report_files;
DROP POLICY IF EXISTS "Admins can view all report files" ON report_files;

-- RLS Policies for report_files
CREATE POLICY "Users can view own report files"
  ON report_files FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own report files"
  ON report_files FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all report files"
  ON report_files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ================================================================
-- 5. TRIGGER FOR UPDATED_AT TIMESTAMP
-- ================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for analyses table
DROP TRIGGER IF EXISTS update_analyses_updated_at ON analyses;
CREATE TRIGGER update_analyses_updated_at
    BEFORE UPDATE ON analyses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- 6. FUNCTION TO CREATE PROFILE ON USER SIGNUP
-- ================================================================

-- This function automatically creates a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ================================================================
-- 7. SAMPLE ADMIN USER (OPTIONAL)
-- ================================================================

-- To create an admin user, first create the user via Supabase Auth UI
-- or signup flow, then run this query with their user ID:

-- UPDATE profiles
-- SET is_admin = TRUE
-- WHERE email = 'admin@yieldpulse.com';

-- ================================================================
-- END OF SCHEMA
-- ================================================================

-- Verification Queries (optional - run to verify setup)
-- SELECT * FROM profiles;
-- SELECT * FROM analyses;
-- SELECT * FROM payments;
-- SELECT * FROM report_files;
