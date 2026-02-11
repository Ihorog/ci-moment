# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- **Payment Provider Migration**: Migrated from Stripe to Fondy payment gateway
  - Removed Stripe npm dependency
  - Removed Stripe webhook handler (`/app/api/webhook/route.ts`)
  - Updated payment flow to use Fondy API integration
  - Replaced `stripe_session_id` with generic `payment_id` in database schema
  - Updated all documentation to reflect Fondy integration
  - Updated SealButton component to call `/api/seal` endpoint

## [1.0.0] - 2026-02-09

### Initial Release

#### Added
- **Core Decision Engine**: Deterministic status calculation based on UTC time and context
- **Three Decision Contexts**: Career, Love, and Timing with unique status outcomes
- **Artifact System**: Cryptographically secure artifact code generation (format: ci-XX-XXXXX)
- **Payment Integration**: Payment gateway integration for sealing decisions permanently
- **Verification System**: SHA-256 based verification for sealed artifacts
- **Database Layer**: PostgreSQL via Supabase with full TypeScript types
- **API Endpoints**:
  - `/api/seal` - Payment initiation and artifact creation
- **User Interface**:
  - Landing screen with context selection
  - Confirmation threshold screen
  - Animated manifest loading screen
  - Result display with artifact details
  - Seal button with payment flow
  - Verification page for sealed artifacts
- **Security Features**:
  - Payment signature verification
  - Server-side environment variable validation
  - SQL injection protection via Supabase client
  - HTTPS-only in production
  - Comprehensive security headers
- **SEO & Metadata**:
  - Open Graph tags for social sharing
  - Twitter Card metadata
  - Dynamic sitemap generation
  - Robots.txt configuration
  - Optimized metadata for search engines
- **Deployment**:
  - Optimized for Vercel deployment
  - Environment variable validation
  - Automatic deployments on push
  - Preview deployments for pull requests
- **Documentation**:
  - Comprehensive README with quick start guide
  - Detailed deployment guide (DEPLOYMENT.md)
  - Supabase setup guide (SUPABASE-SETUP.md)
  - Marketing guide (MARKETING.md)
  - Launch checklist (LAUNCH-CHECKLIST.md)

#### Technical Specifications
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: Inline CSS for minimal approach
- **Database**: Supabase (PostgreSQL)
- **Payments**: Fondy payment gateway
- **Node.js**: Version 20.x or higher required
- **Type Safety**: Full TypeScript coverage with no errors
- **Code Quality**: ESLint configured with Next.js rules

#### Architecture Highlights
- Serverless architecture built for Vercel
- Server-side rendering for optimal performance
- Type-safe database queries
- Deterministic decision algorithm
- Secure payment flow with proper verification
- Graceful error handling throughout

---

## Future Releases

For planned features and roadmap, see the Roadmap section in README.md.

## Release Process

1. Update version in `package.json`
2. Update this CHANGELOG with new changes
3. Commit changes: `git commit -m "Release vX.Y.Z"`
4. Create git tag: `git tag -a vX.Y.Z -m "Version X.Y.Z"`
5. Push changes: `git push && git push --tags`
6. Create GitHub release from tag with notes from CHANGELOG

## Categories

- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Features to be removed in future releases
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements
