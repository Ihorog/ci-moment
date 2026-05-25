# Database Verification Script

This directory contains the database verification and configuration tool for Ci Moment.

## Overview

The `check-database.js` script is a command-line tool that:
- ✅ Verifies Supabase connection
- ✅ Checks if the database schema exists
- ✅ Validates schema structure
- ✅ Provides database statistics
- ✅ Displays helpful error messages and setup instructions

## Quick Start

### 1. Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
SUPABASE_URL=https://yksycpmsgljpfzzvqzzw.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

**Important**: Replace `your-service-role-key-here` with your actual service role key from Supabase Dashboard.

### 2. Run the Verification Script

```bash
npm run check-db
```

## Usage

### Basic Check

```bash
npm run check-db
```

This will:
1. Verify environment variables are set
2. Test database connection
3. Check if artifacts table exists
4. Validate schema structure
5. Display database statistics

### Expected Output (Success)

```
🔍 Ci Moment Database Verification Tool

=== Environment Configuration ===
✓ Environment variables are configured
ℹ Database URL: https://yksycpmsgljpfzzvqzzw.supabase.co

=== Database Connection ===
✓ Database connection successful

=== Schema Verification ===
✓ Artifacts table exists
✓ Schema structure is valid

=== Database Statistics ===
✓ Total artifacts: 42 (15 sealed)

=== Summary ===
✓ Database is properly configured and ready to use

ℹ Next steps:
ℹ   • Run your application: npm run dev
ℹ   • Run tests: npm test
ℹ   • Deploy to production: vercel deploy
```

## Getting Your Supabase Credentials

### For Project: yksycpmsgljpfzzvqzzw

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `yksycpmsgljpfzzvqzzw`
3. Click on **Settings** (gear icon) → **API**
4. Copy the following:
   - **Project URL**: `https://yksycpmsgljpfzzvqzzw.supabase.co`
   - **service_role key**: The long JWT token (keep this secret!)

### Environment Setup

**Local Development (.env.local)**:
```bash
SUPABASE_URL=https://yksycpmsgljpfzzvqzzw.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...your-actual-key-here
```

**Vercel Deployment**:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add both variables for all environments (Production, Preview, Development)

## Troubleshooting

### Error: "Environment variables are not configured"

**Solution**:
- Create `.env.local` file with your Supabase credentials
- Ensure there are no typos in variable names
- Make sure values are not the placeholders from `.env.example`

### Error: "Failed to connect to database"

**Possible causes**:
- Invalid SUPABASE_URL
- Invalid SUPABASE_SERVICE_KEY
- Network connectivity issues
- Supabase project is paused (free tier auto-pauses after inactivity)

**Solution**:
1. Verify credentials in Supabase Dashboard → Settings → API
2. Check your internet connection
3. Ensure the Supabase project is active

### Error: "Artifacts table does not exist"

**Solution**: Run the database schema setup:

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **SQL Editor**
3. Click **New query**
4. Copy and paste the contents of `db/schema.sql`
5. Click **Run** to execute
6. Run `npm run check-db` again to verify

### Error: "Schema validation failed"

**Possible causes**:
- Schema is outdated
- Missing required columns
- Wrong column types

**Solution**:
1. Compare your current schema with `db/schema.sql`
2. Update schema as needed in Supabase Dashboard
3. Consider backing up data before schema changes

## What Gets Verified

### 1. Environment Configuration
- Checks if SUPABASE_URL is set
- Checks if SUPABASE_SERVICE_KEY is set
- Verifies they are not placeholder values

### 2. Database Connection
- Tests connection to Supabase
- Validates credentials
- Ensures network connectivity

### 3. Schema Verification
- Checks if `artifacts` table exists
- Validates table structure by inserting/deleting a test record
- Verifies all required columns are present

### 4. Statistics
- Counts total artifacts
- Counts sealed artifacts
- Provides overview of database usage

## Integration with CI/CD

You can add this check to your CI pipeline:

**GitHub Actions Example**:
```yaml
- name: Check Database Configuration
  run: npm run check-db
  env:
    SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
```

## Security Notes

- ⚠️ **Never commit** `.env.local` to Git
- ⚠️ The service role key has **full database access**
- ⚠️ Only use service role key on the **server side**
- ⚠️ Store credentials in environment variables or secrets manager

## Files

- `check-database.js` - Main verification script (JavaScript)
- `check-database.ts` - TypeScript version (for reference)
- `README.md` - This file

## Related Documentation

- [SUPABASE-SETUP.md](../docs/SUPABASE-SETUP.md) - Complete Supabase setup guide
- [DEPLOYMENT.md](../docs/DEPLOYMENT.md) - Deployment instructions
- [schema.sql](../db/schema.sql) - Database schema

## Support

For issues with this script or database setup:
1. Check [SUPABASE-SETUP.md](../docs/SUPABASE-SETUP.md)
2. Review error messages carefully
3. Open an issue on GitHub with the error output

---

**Last Updated**: 2026-03-12
**Maintained by**: @Ihorog
