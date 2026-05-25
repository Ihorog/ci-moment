# Release Notes Template

Use this template when creating GitHub releases.

---

## Version [X.Y.Z] - YYYY-MM-DD

### 🎉 Highlights

[Brief description of the most important changes in this release]

### ✨ What's New

#### Features
- Feature 1 description
- Feature 2 description
- ...

#### Improvements
- Improvement 1 description
- Improvement 2 description
- ...

### 🐛 Bug Fixes

- Bug fix 1 description
- Bug fix 2 description
- ...

### 🔒 Security

- Security fix 1 description (if applicable)
- Security fix 2 description (if applicable)

### 🔧 Changes

#### Breaking Changes
- Breaking change 1 (if applicable)
- Breaking change 2 (if applicable)

#### Deprecations
- Deprecated feature 1 (if applicable)
- ...

### 📦 Dependencies

- Updated dependency X from version A to B
- Added dependency Y version Z
- ...

### 📝 Documentation

- Documentation update 1
- Documentation update 2
- ...

### 🙏 Contributors

Thank you to everyone who contributed to this release:
- @contributor1
- @contributor2
- ...

### 📥 Installation

#### For New Deployments

```bash
git clone https://github.com/Ihorog/ci-moment.git
cd ci-moment
git checkout vX.Y.Z
npm install
# Follow setup instructions in README.md
```

#### For Updates

```bash
cd ci-moment
git fetch origin
git checkout vX.Y.Z
npm install
npm run build
# Restart your application
```

### ⚠️ Migration Guide

[Include if there are breaking changes]

If upgrading from version X.Y.Z:

1. Step 1
2. Step 2
3. ...

### 🔗 Links

- [Full Changelog](https://github.com/Ihorog/ci-moment/compare/vX.Y.Z-1...vX.Y.Z)
- [Documentation](https://github.com/Ihorog/ci-moment/tree/vX.Y.Z/docs)
- [Issues Fixed](https://github.com/Ihorog/ci-moment/issues?q=milestone%3AvX.Y.Z)

### ✅ Verification

This release has been tested with:
- Node.js 20.x
- npm 10.x
- TypeScript 5.4.x
- Next.js 14.2.x

All checks passing:
- ✅ Type check
- ✅ Linting
- ✅ Production build
- ✅ Manual testing

---

## For Version 1.0.0 Specifically:

### 🎉 Initial Release

**Ci Moment** is now available! 🚀

A minimalist SaaS decision tool built with Next.js 14, TypeScript, Stripe, and Supabase.

#### What You Can Do

1. **Make Decisions**: Choose between Career, Love, or Timing contexts
2. **Lock Your Moment**: Each decision is locked to a specific UTC minute
3. **Seal Forever**: Pay $5 via Stripe to permanently seal your decision
4. **Verify Authenticity**: Use verification links to confirm sealed artifacts

#### Core Features

- ✨ Deterministic decision engine based on UTC time
- 🔐 Cryptographically secure artifact generation
- 💳 Stripe payment integration
- 📊 PostgreSQL database via Supabase
- 🚀 Optimized for Vercel deployment
- 🔒 Comprehensive security measures
- 📱 Responsive design
- 🎯 SEO optimized

#### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Deployment**: Vercel

#### Getting Started

1. Clone the repository
2. Follow the [Quick Start Guide](https://github.com/Ihorog/ci-moment#-quick-start)
3. Check the [Documentation](https://github.com/Ihorog/ci-moment/tree/main/docs)

#### Documentation

- 📖 [README](https://github.com/Ihorog/ci-moment/blob/v1.0.0/README.md)
- 🚀 [Deployment Guide](https://github.com/Ihorog/ci-moment/blob/v1.0.0/docs/DEPLOYMENT.md)
- 💳 [Stripe Setup](https://github.com/Ihorog/ci-moment/blob/v1.0.0/docs/STRIPE-SETUP.md)
- 🗄️ [Supabase Setup](https://github.com/Ihorog/ci-moment/blob/v1.0.0/docs/SUPABASE-SETUP.md)
- 📊 [Marketing Guide](https://github.com/Ihorog/ci-moment/blob/v1.0.0/docs/MARKETING.md)
- ✅ [Launch Checklist](https://github.com/Ihorog/ci-moment/blob/v1.0.0/docs/LAUNCH-CHECKLIST.md)

#### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ihorog/ci-moment)

#### System Requirements

- Node.js 20.x or higher
- npm 10.x or higher
- Supabase account
- Stripe account
- Vercel account (for deployment)

#### Known Limitations

See [SECURITY.md](https://github.com/Ihorog/ci-moment/blob/v1.0.0/SECURITY.md) for current security considerations and recommendations.

#### Support

- 🐛 [Report Issues](https://github.com/Ihorog/ci-moment/issues)
- 💬 [Discussions](https://github.com/Ihorog/ci-moment/discussions)
- 📧 Check repository for contact information

#### License

Proprietary - See [LICENSE](https://github.com/Ihorog/ci-moment/blob/v1.0.0/LICENSE) for details.

---

**Thank you for using Ci Moment!** 🎊
