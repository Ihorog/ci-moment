# Quick Database Setup Guide

This guide helps you configure the Supabase database for the Ci Moment project.

## Database Information

**Project ID**: `yksycpmsgljpfzzvqzzw`
**Database URL**: `https://yksycpmsgljpfzzvqzzw.supabase.co`
**Connection String**: `postgresql://postgres:[YOUR-PASSWORD]@db.yksycpmsgljpfzzvqzzw.supabase.co:5432/postgres`

## Step 1: Get Your Service Role Key

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select project: **yksycpmsgljpfzzvqzzw**
3. Click **Settings** (gear icon) → **API**
4. Find the **Project API keys** section
5. Copy the `service_role` key (it's a long JWT token starting with `eyJ...`)

⚠️ **Important**: Keep this key secret! Never commit it to Git or share it publicly.

## Step 2: Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Supabase Configuration
SUPABASE_URL=https://yksycpmsgljpfzzvqzzw.supabase.co
SUPABASE_SERVICE_KEY=eyJ...your-actual-service-key-here...
```

## Step 3: Verify Database Connection

Run the verification script:

```bash
npm run check-db
```

**If you see**: ✓ Database connection successful
→ Great! Move to Step 4.

**If you see**: ✗ Failed to connect to database
→ Check your credentials in .env.local

## Step 4: Initialize Database Schema

If the verification script reports that the table doesn't exist, you need to initialize the schema:

### Option A: Using Supabase Dashboard (Recommended)

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Select project: **yksycpmsgljpfzzvqzzw**
3. Click **SQL Editor** in the sidebar
4. Click **New query**
5. Copy the contents of `db/schema.sql` from this repository
6. Paste into the SQL editor
7. Click **Run** (or press Cmd/Ctrl + Enter)
8. Wait for "Success" message

### Option B: Using PostgreSQL Client

If you prefer using a PostgreSQL client (psql, pgAdmin, etc.):

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.yksycpmsgljpfzzvqzzw.supabase.co:5432/postgres" < db/schema.sql
```

Replace `[YOUR-PASSWORD]` with your database password.

## Step 5: Verify Setup

Run the verification script again:

```bash
npm run check-db
```

You should see:
```
✓ Environment variables are configured
✓ Database connection successful
✓ Artifacts table exists
✓ Schema structure is valid
✓ Total artifacts: 0 (0 sealed)
✓ Database is properly configured and ready to use
```

## Step 6: Test the Application

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 and test the full flow:
1. Select a context (Career/Love/Timing)
2. Complete the decision flow
3. The app should work without database errors

## Troubleshooting

### "Environment variables are not configured"

**Fix**: Make sure `.env.local` exists and contains both variables.

### "Failed to connect to database"

**Possible causes**:
- Wrong service role key
- Network connectivity issue
- Project is paused (free tier auto-pauses)

**Fix**:
1. Double-check the service key in Supabase Dashboard → Settings → API
2. Ensure your Supabase project is active
3. Check your internet connection

### "Artifacts table does not exist"

**Fix**: Follow Step 4 to initialize the database schema.

### "Schema validation failed"

**Possible causes**:
- Schema is incomplete
- Missing columns
- Wrong data types

**Fix**:
1. Drop the existing table: `DROP TABLE artifacts CASCADE;`
2. Re-run the schema from `db/schema.sql`

## Production Deployment

When deploying to Vercel or other platforms:

1. Add environment variables in your hosting platform:
   - `SUPABASE_URL=https://yksycpmsgljpfzzvqzzw.supabase.co`
   - `SUPABASE_SERVICE_KEY=your-service-key`

2. For Vercel:
   - Go to Project Settings → Environment Variables
   - Add both variables for all environments (Production, Preview, Development)

## Security Checklist

- [ ] `.env.local` is in `.gitignore` (already done)
- [ ] Service role key is never committed to Git
- [ ] Service role key is only used server-side
- [ ] Production uses separate credentials from development (optional)

## Database Limits (Free Tier)

- **Storage**: 500 MB
- **Bandwidth**: 2 GB/month
- **Database Size**: Max 500 MB
- **Concurrent Connections**: 60

For production use, consider upgrading to Pro plan ($25/month).

## Next Steps

After setting up the database:

1. ✅ Run `npm run check-db` to verify
2. ✅ Run `npm run dev` to test locally
3. ✅ Run `npm test` to verify all tests pass
4. ✅ Deploy to Vercel/production
5. ✅ Set up monitoring (optional)

## Support

For issues with database setup:
- Check [SUPABASE-SETUP.md](./docs/SUPABASE-SETUP.md) for detailed instructions
- Review [scripts/README.md](./scripts/README.md) for verification script details
- Open an issue on GitHub

---

**Last Updated**: 2026-03-12
