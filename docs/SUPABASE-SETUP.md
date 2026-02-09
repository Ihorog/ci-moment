# Supabase Setup Guide

This guide covers setting up Supabase (PostgreSQL database) for Ci Moment.

## Table of Contents

- [Overview](#overview)
- [Creating a Supabase Project](#creating-a-supabase-project)
- [Database Schema Setup](#database-schema-setup)
- [Configuration](#configuration)
- [Testing the Connection](#testing-the-connection)
- [Production Considerations](#production-considerations)
- [Troubleshooting](#troubleshooting)

## Overview

Ci Moment uses Supabase as its PostgreSQL database to store:

- **Artifacts**: Decision records with context, status, and seal information
- **Metadata**: Verification hashes, timestamps, and Stripe session IDs

Key features:
- **Serverless**: No database server management required
- **Real-time**: Built-in support for real-time subscriptions (not currently used)
- **Auth**: Built-in authentication (not currently used)
- **Row Level Security**: Disabled for simplicity (service role key bypasses RLS)

## Creating a Supabase Project

### Step 1: Sign Up for Supabase

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email

### Step 2: Create a New Project

1. Click "New Project" in the dashboard
2. Fill in project details:
   - **Name**: `ci-moment` (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., US East for USA)
   - **Pricing Plan**: Free tier is sufficient for development
3. Click "Create new project"
4. Wait 1-2 minutes for project provisioning

### Step 3: Get Your API Credentials

After project creation:

1. Go to **Project Settings** (gear icon) → **API**
2. Copy the following values:

```
Project URL: https://abcdefghijk.supabase.co
```

Under "Project API keys":
```
anon public: eyJhbGc... (not needed for this app)
service_role: eyJhbGc... (REQUIRED - keep secret!)
```

⚠️ **Important**: The `service_role` key has full database access. Never expose it in client-side code.

## Database Schema Setup

### Step 1: Open SQL Editor

1. In Supabase Dashboard, click **SQL Editor** in the sidebar
2. Click **New query**

### Step 2: Run Schema SQL

Copy the entire contents of `db/schema.sql` from your project:

```sql
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
```

### Step 3: Execute the Query

1. Paste the SQL into the editor
2. Click **Run** (or press Cmd/Ctrl + Enter)
3. Verify success message: "Success. No rows returned"

### Step 4: Verify Table Creation

1. Click **Table Editor** in the sidebar
2. You should see the `artifacts` table
3. Click on it to view the schema

Expected columns:
- `id` (uuid)
- `artifact_code` (text)
- `context` (text)
- `status` (text)
- `locked_minute_utc` (int4)
- `locked_at_utc` (timestamptz)
- `is_sealed` (bool)
- `sealed_at_utc` (timestamptz)
- `verify_hash` (text)
- `stripe_session_id` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## Configuration

### Local Development

Create or update `.env.local`:

```env
SUPABASE_URL=https://abcdefghijk.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Vercel Production

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add variables for all environments (Production, Preview, Development):

```
Name: SUPABASE_URL
Value: https://abcdefghijk.supabase.co
Environments: Production, Preview, Development
```

```
Name: SUPABASE_SERVICE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environments: Production, Preview, Development
```

3. Redeploy your application

## Testing the Connection

### Test 1: Manual Query

In Supabase SQL Editor:

```sql
-- Insert a test artifact
INSERT INTO artifacts (
  artifact_code,
  context,
  status,
  locked_minute_utc,
  locked_at_utc,
  verify_hash
) VALUES (
  'ci-test-12345',
  'career',
  'PROCEED',
  28512345,
  '2026-03-15T10:30:00Z',
  'abcdef0123456789'
);

-- Query it back
SELECT * FROM artifacts WHERE artifact_code = 'ci-test-12345';

-- Clean up
DELETE FROM artifacts WHERE artifact_code = 'ci-test-12345';
```

### Test 2: Application Test

Run your app locally:

```bash
npm run dev
```

Complete a full flow:
1. Select a context
2. Complete the decision flow
3. Click "Seal This Moment"
4. Complete Stripe payment (test mode)

Then check the database:

```sql
SELECT 
  artifact_code,
  context,
  status,
  is_sealed,
  created_at
FROM artifacts
ORDER BY created_at DESC
LIMIT 5;
```

You should see your test artifact.

### Test 3: API Test

Test the Supabase connection directly:

```bash
# Create a simple test file
cat > test-supabase.js << 'EOF'
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('artifacts')
    .select('count')
    .limit(1);
    
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('✅ Supabase connection successful!');
    console.log('Data:', data);
  }
}

test();
EOF

# Run the test
node test-supabase.js

# Clean up
rm test-supabase.js
```

## Production Considerations

### Database Limits (Free Tier)

- **Storage**: 500 MB
- **Bandwidth**: 2 GB
- **Database size**: Max 500 MB
- **Connections**: 60 concurrent

For production, consider:
- Monitoring database size
- Archiving old artifacts
- Upgrading to Pro plan ($25/month) for higher limits

### Optimization

#### Index Usage

The schema includes indexes for common queries:

```sql
-- Fast lookup by verification hash (most common)
CREATE INDEX idx_artifacts_verify_hash ON artifacts(verify_hash);

-- Fast lookup by artifact code
CREATE INDEX idx_artifacts_artifact_code ON artifacts(artifact_code);

-- Filter by seal status
CREATE INDEX idx_artifacts_is_sealed ON artifacts(is_sealed);

-- Sort by creation date
CREATE INDEX idx_artifacts_created_at ON artifacts(created_at DESC);
```

#### Query Performance

Monitor slow queries in Supabase Dashboard:
1. Go to **Database** → **Query Performance**
2. Review slow queries
3. Add indexes if needed

### Backups

Supabase automatically backs up your database:
- **Free tier**: Daily backups, 7-day retention
- **Pro tier**: Point-in-time recovery (PITR)

To manually export your data:

```sql
-- Export all artifacts
SELECT * FROM artifacts;
```

Save as CSV or JSON.

### Connection Pooling

Supabase uses PgBouncer for connection pooling. The service role key automatically uses the connection pool.

For high-traffic applications:
- Monitor connection count in Supabase Dashboard
- Consider increasing connection limits (Pro plan)
- Implement connection retry logic

### Security

#### Row Level Security (RLS)

Currently **disabled** for simplicity. The service role key bypasses RLS.

To enable RLS for future auth integration:

```sql
-- Enable RLS
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;

-- Create policies (example)
CREATE POLICY "Allow public read of sealed artifacts"
ON artifacts FOR SELECT
USING (is_sealed = true);

CREATE POLICY "Allow service role full access"
ON artifacts FOR ALL
USING (true);
```

#### API Key Security

- ✅ Service role key is server-side only
- ✅ Never exposed in client code
- ✅ Stored in environment variables
- ✅ Not committed to Git

### Monitoring

Monitor database health in Supabase Dashboard:

1. **Database** → **Logs**: View query logs
2. **Database** → **Activity**: Monitor connections
3. **Database** → **Advisors**: Performance recommendations

Set up alerts:
- High connection count
- Slow queries
- High disk usage

## Troubleshooting

### "Failed to connect to Supabase"

**Cause**: Invalid credentials or network issue.

**Solution**:
1. Verify `SUPABASE_URL` format: `https://xxx.supabase.co`
2. Check `SUPABASE_SERVICE_KEY` is complete (very long JWT string)
3. Ensure no trailing spaces in environment variables
4. Test connection in Supabase SQL Editor
5. Check project is not paused (free tier auto-pauses after inactivity)

### "relation artifacts does not exist"

**Cause**: Schema not created.

**Solution**:
1. Run the schema SQL in Supabase SQL Editor
2. Verify table exists in Table Editor
3. Check you're connected to the correct project

### "duplicate key value violates unique constraint"

**Cause**: Trying to insert artifact with existing `artifact_code` or `verify_hash`.

**Solution**:
1. Check for duplicate artifact codes (should be very rare due to crypto randomness)
2. Verify hash generation is working correctly
3. Check application logic for retry issues

### "permission denied for table artifacts"

**Cause**: Using wrong API key or RLS blocking access.

**Solution**:
1. Use `SUPABASE_SERVICE_KEY`, not anon key
2. Verify service role key has full permissions
3. Check RLS policies if enabled

### Connection pool exhausted

**Cause**: Too many concurrent connections.

**Solution**:
1. Ensure Supabase client is reused (singleton pattern)
2. Check for connection leaks in code
3. Monitor connection count in Supabase Dashboard
4. Upgrade to Pro plan for more connections

### Slow queries

**Cause**: Missing indexes or complex queries.

**Solution**:
1. Check query performance in Supabase Dashboard
2. Ensure indexes exist (see schema)
3. Add EXPLAIN ANALYZE to slow queries:
```sql
EXPLAIN ANALYZE SELECT * FROM artifacts WHERE verify_hash = 'abc123';
```
4. Add indexes for frequently queried columns

## Maintenance Tasks

### Periodic Cleanup (Optional)

Archive or delete old unsealed artifacts:

```sql
-- Find old unsealed artifacts (> 30 days)
SELECT artifact_code, created_at
FROM artifacts
WHERE is_sealed = false
AND created_at < NOW() - INTERVAL '30 days';

-- Delete them (after verification)
DELETE FROM artifacts
WHERE is_sealed = false
AND created_at < NOW() - INTERVAL '30 days';
```

### Database Stats

```sql
-- Count total artifacts
SELECT COUNT(*) FROM artifacts;

-- Count by seal status
SELECT is_sealed, COUNT(*) 
FROM artifacts 
GROUP BY is_sealed;

-- Count by context
SELECT context, COUNT(*) 
FROM artifacts 
GROUP BY context;

-- Recent sealed artifacts
SELECT artifact_code, context, status, sealed_at_utc
FROM artifacts
WHERE is_sealed = true
ORDER BY sealed_at_utc DESC
LIMIT 10;
```

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Client Library](https://supabase.com/docs/reference/javascript/introduction)
- [Database Performance](https://supabase.com/docs/guides/platform/performance)
- [Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)

## Support

For Supabase issues:
1. Check [Supabase Status](https://status.supabase.com)
2. Review [Supabase Community](https://github.com/supabase/supabase/discussions)
3. Contact [Supabase Support](https://supabase.com/support)
