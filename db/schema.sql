-- Ci Moment Database Schema
-- PostgreSQL / Supabase

-- Artifacts table stores all Ci Moment decisions and their seal status
CREATE TABLE IF NOT EXISTS artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artifact_code TEXT UNIQUE NOT NULL,
  context TEXT NOT NULL CHECK (context IN ('career', 'love', 'timing')),
  status TEXT NOT NULL CHECK (status IN ('PROCEED', 'HOLD', 'NOT NOW')),
  locked_minute_utc INTEGER NOT NULL,
  locked_at_utc TIMESTAMPTZ NOT NULL,
  is_sealed BOOLEAN DEFAULT FALSE NOT NULL,
  sealed_at_utc TIMESTAMPTZ,
  verify_hash TEXT UNIQUE NOT NULL,
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_artifacts_verify_hash ON artifacts(verify_hash);
CREATE INDEX IF NOT EXISTS idx_artifacts_artifact_code ON artifacts(artifact_code);
CREATE INDEX IF NOT EXISTS idx_artifacts_is_sealed ON artifacts(is_sealed);
CREATE INDEX IF NOT EXISTS idx_artifacts_created_at ON artifacts(created_at DESC);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the update function
CREATE TRIGGER update_artifacts_updated_at
  BEFORE UPDATE ON artifacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE artifacts IS 'Stores Ci Moment decisions with seal status';
COMMENT ON COLUMN artifacts.artifact_code IS 'Unique identifier in format ci-XX-XXXXX';
COMMENT ON COLUMN artifacts.context IS 'User selected context: career, love, or timing';
COMMENT ON COLUMN artifacts.status IS 'Engine determined status: PROCEED, HOLD, or NOT NOW';
COMMENT ON COLUMN artifacts.locked_minute_utc IS 'Unix timestamp in minutes when decision was locked';
COMMENT ON COLUMN artifacts.verify_hash IS 'SHA256 hash for verification URL';
COMMENT ON COLUMN artifacts.is_sealed IS 'Whether payment was completed';
COMMENT ON COLUMN artifacts.stripe_session_id IS 'Stripe checkout session ID if sealed';
