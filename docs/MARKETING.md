# Marketing Guide

Pre-launch marketing preparation and strategies for Ci Moment.

## Table of Contents

- [Pre-Launch Checklist](#pre-launch-checklist)
- [SEO Optimization](#seo-optimization)
- [Social Media Assets](#social-media-assets)
- [Landing Page Optimization](#landing-page-optimization)
- [Analytics Setup](#analytics-setup)
- [Launch Strategy](#launch-strategy)
- [Growth Tactics](#growth-tactics)

## Pre-Launch Checklist

Complete these tasks before publicly launching Ci Moment:

### Technical Preparation

- [ ] Domain configured (custom domain vs. Vercel subdomain)
- [ ] SSL certificate active (HTTPS)
- [ ] SEO metadata added to all pages
- [ ] Open Graph tags configured
- [ ] Twitter Card tags configured
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] Favicon and app icons added
- [ ] 404 page customized
- [ ] Loading states optimized
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing completed
- [ ] Page speed optimization (Lighthouse > 90)

### Business Preparation

- [ ] Pricing finalized ($5.00 per seal)
- [ ] Terms of Service drafted
- [ ] Privacy Policy created
- [ ] Refund policy defined
- [ ] Customer support email set up
- [ ] Payment processing tested
- [ ] Stripe account verified (business info)
- [ ] Bank account connected for payouts

### Marketing Assets

- [ ] Brand identity finalized
- [ ] Logo created (if not using minimal "Ci" text)
- [ ] Social media profiles created
- [ ] Press kit prepared
- [ ] Screenshots captured
- [ ] Demo video recorded (optional)
- [ ] Product description written
- [ ] Value proposition refined

### Content Preparation

- [ ] About page created
- [ ] FAQ section added
- [ ] Blog set up (optional)
- [ ] Email capture system (optional)
- [ ] Welcome email drafted (optional)

## SEO Optimization

### Meta Tags

Add to `app/layout.tsx`:

```tsx
export const metadata = {
  title: 'Ci Moment - Your Personal Decision Signal',
  description: 'Check your unique moment status for Career, Love, or Timing. A minimalist decision tool that captures your specific moment in time.',
  keywords: 'decision making, personal moment, timing, career guidance, relationship timing',
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  publisher: 'Your Name',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Ci Moment - Your Personal Decision Signal',
    description: 'Check your unique moment status for Career, Love, or Timing.',
    url: 'https://ci-moment.vercel.app',
    siteName: 'Ci Moment',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://ci-moment.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ci Moment - Your Personal Decision Signal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ci Moment - Your Personal Decision Signal',
    description: 'Check your unique moment status for Career, Love, or Timing.',
    images: ['https://ci-moment.vercel.app/twitter-image.png'],
    creator: '@yourtwitterhandle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};
```

### Sitemap

Create `app/sitemap.ts`:

```tsx
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ci-moment.vercel.app';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // Add other pages as needed
  ];
}
```

### Robots.txt

Create `app/robots.ts`:

```tsx
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://ci-moment.vercel.app';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/verify/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

### Structured Data (JSON-LD)

Add to landing page for rich snippets:

```tsx
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Ci Moment',
  applicationCategory: 'UtilityApplication',
  offers: {
    '@type': 'Offer',
    price: '5.00',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '100',
  },
};

// Add to <head>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
/>
```

## Social Media Assets

### Open Graph Image

Create an image (`public/og-image.png`):
- **Size**: 1200x630 pixels
- **Format**: PNG or JPEG
- **Content**: App name, tagline, clean design
- **Text**: Large, readable at small sizes

### Twitter Card Image

Create an image (`public/twitter-image.png`):
- **Size**: 1200x600 pixels
- **Format**: PNG or JPEG
- **Content**: Similar to OG image but optimized for Twitter

### Favicon

Create multiple sizes:
- `favicon.ico` (32x32)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)

Place in `app/` directory or configure in `layout.tsx`:

```tsx
export const metadata = {
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};
```

### Social Media Profiles

Create profiles on:
- **Twitter/X**: Share updates, engage with users
- **Product Hunt**: Launch product for visibility
- **Reddit**: Engage in relevant communities (r/SideProject, r/productivity)
- **Hacker News**: Show HN post (if technical audience fits)
- **LinkedIn**: Professional context (career-focused)

## Landing Page Optimization

### Current Landing Page

The current landing page is minimal. Consider adding:

### Value Proposition (Above the Fold)

```tsx
<div style={{ textAlign: 'center', marginBottom: '2rem' }}>
  <h1>Is now your Ci Moment?</h1>
  <p style={{ fontSize: '1.1rem', color: '#999' }}>
    A personal moment signal for career, love, and timing decisions.
  </p>
  <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
    Each moment is unique. Lock yours forever.
  </p>
</div>
```

### Social Proof

Add below the main CTA:

```tsx
<div style={{ marginTop: '3rem', textAlign: 'center' }}>
  <p style={{ fontSize: '0.75rem', color: '#555' }}>
    Join 1,000+ people who've captured their Ci Moment
  </p>
</div>
```

### Trust Indicators

- Payment security badge (Stripe logo)
- "Money-back guarantee" if applicable
- Testimonials (after launch)

### Call-to-Action Optimization

Current CTAs are clear. Consider A/B testing:
- Button copy: "Career" vs "Check Career"
- Button style: Minimal vs filled
- Button placement: Center vs stacked

## Analytics Setup

### Google Analytics 4

Add to `app/layout.tsx`:

```tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Key Events to Track

```typescript
// Track context selection
gtag('event', 'select_context', {
  context: 'career', // or 'love', 'timing'
});

// Track seal button click
gtag('event', 'begin_checkout', {
  value: 5.00,
  currency: 'USD',
  items: [{
    item_id: artifactCode,
    item_name: 'Ci Moment Seal',
  }],
});

// Track purchase completion
gtag('event', 'purchase', {
  transaction_id: stripeSessionId,
  value: 5.00,
  currency: 'USD',
  items: [{
    item_id: artifactCode,
    item_name: 'Ci Moment Seal',
  }],
});
```

### Vercel Analytics

Enable in Vercel Dashboard:
1. Go to Project → Analytics
2. Enable Web Analytics
3. Add `@vercel/analytics` package:

```bash
npm install @vercel/analytics
```

```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Key Metrics to Monitor

- **Conversion Rate**: Visitors → Sealed Moments
- **Bounce Rate**: % leaving after landing page
- **Avg. Time on Site**: Engagement indicator
- **Context Distribution**: Which contexts are most popular
- **Payment Success Rate**: % completing checkout
- **Verification Page Views**: How many check their sealed moments

## Launch Strategy

### Soft Launch (Week 1)

1. **Private Beta**
   - Share with friends and family
   - Collect initial feedback
   - Test payment flow with real users
   - Fix critical bugs

2. **Metrics to Watch**
   - Payment success rate > 95%
   - No critical errors in logs
   - Webhook delivery success > 99%
   - Page load time < 2s

### Public Launch (Week 2)

1. **Product Hunt**
   - Schedule launch for Tuesday-Thursday (best days)
   - Prepare compelling description
   - Create high-quality screenshots
   - Engage with comments throughout the day
   - Aim for top 5 products of the day

2. **Social Media**
   - Twitter thread explaining the concept
   - LinkedIn post (professional angle)
   - Reddit posts (relevant communities, be authentic)
   - Hacker News "Show HN" (if technical audience fits)

3. **Content Marketing**
   - Write blog post: "Why I built Ci Moment"
   - Share on Medium, Dev.to, Hashnode
   - Create Twitter thread with behind-the-scenes

### Follow-Up (Week 3+)

1. **User Feedback**
   - Send follow-up email to buyers (if collected emails)
   - Ask for testimonials
   - Request feature suggestions

2. **Iteration**
   - Fix reported bugs
   - Add requested features (if aligned with vision)
   - Improve based on analytics

## Growth Tactics

### Organic Growth

1. **SEO**
   - Write blog posts on decision-making
   - Target keywords: "decision tool", "career timing", "relationship timing"
   - Build backlinks through guest posts

2. **Content Marketing**
   - Twitter content about decision-making
   - Share interesting sealed moment statistics (anonymized)
   - Behind-the-scenes of building the app

3. **Community Engagement**
   - Answer questions on Reddit
   - Engage in Twitter conversations
   - Share value before promoting

### Paid Growth (Optional)

1. **Social Media Ads**
   - Facebook/Instagram: Target interest in decision-making, self-improvement
   - Twitter: Promoted tweets targeting relevant keywords
   - Budget: Start small ($100-500) to test

2. **Google Ads**
   - Search ads for "decision making tool"
   - Display ads on relevant sites
   - Track conversion cost

### Partnerships

1. **Influencer Outreach**
   - Micro-influencers in productivity/self-improvement
   - Offer free seals in exchange for honest review
   - Track with unique links

2. **Affiliate Program** (Future)
   - Offer commission for referrals
   - Provide unique referral codes
   - Track via Stripe metadata

## Email Marketing (Optional)

### Capture Emails

Add email capture on landing page:

```tsx
<form style={{ marginTop: '2rem' }}>
  <input
    type="email"
    placeholder="Get notified of updates"
    style={{ padding: '0.75rem', marginRight: '0.5rem' }}
  />
  <button type="submit">Subscribe</button>
</form>
```

### Email Sequences

1. **Welcome Email**: Explain the concept
2. **Usage Tips**: How to interpret your moment
3. **Follow-Up**: Ask for feedback
4. **Reengagement**: Remind to check new context

## Measuring Success

### Key Performance Indicators (KPIs)

- **Visitors**: Monthly unique visitors
- **Conversion Rate**: Visitors → Sealed Moments
- **Revenue**: Monthly recurring revenue (MRR)
- **Average Transaction Value**: $5 (fixed for now)
- **Customer Acquisition Cost (CAC)**: Marketing spend / new customers
- **Lifetime Value (LTV)**: Average revenue per customer
- **Viral Coefficient**: How many friends each user brings

### Goals (First 3 Months)

- [ ] 1,000 visitors
- [ ] 50 sealed moments
- [ ] $250 in revenue
- [ ] 10+ pieces of user feedback
- [ ] 3+ testimonials
- [ ] 100+ social media followers

## Legal & Compliance

### Required Pages

Create these pages before public launch:

1. **Terms of Service** (`/terms`)
   - Service usage rules
   - Payment terms
   - Refund policy
   - Liability limitations

2. **Privacy Policy** (`/privacy`)
   - Data collection practices
   - Cookie usage
   - Third-party services (Stripe, Supabase)
   - User rights (GDPR, CCPA)

3. **Refund Policy**
   - Conditions for refunds
   - Process to request refund
   - Timeframe for processing

### GDPR Compliance

If targeting EU users:
- [ ] Add cookie consent banner
- [ ] Provide data export mechanism
- [ ] Allow data deletion requests
- [ ] Disclose data processing

## Automation Ideas (Future)

1. **Automated Social Sharing**
   - Generate shareable images of sealed moments
   - One-click Twitter sharing
   - "I captured my Ci Moment" template

2. **Email Notifications**
   - Send email after seal completion
   - Weekly digest of sealed moments (if user has multiple)
   - Anniversary notifications

3. **Referral Program**
   - Give referrer credit for friend's seal
   - Track via unique links
   - Automate payouts

## Resources

- [Product Hunt Launch Guide](https://www.producthunt.com/launch)
- [Indie Hackers](https://www.indiehackers.com/) - Community and advice
- [How to Market a SaaS](https://www.saastr.com/)
- [SEO for Developers](https://www.ahrefs.com/blog/seo-for-startups/)

## Summary

Focus on:
1. ✅ Technical preparation (SEO, analytics)
2. ✅ Soft launch with friends/family
3. ✅ Product Hunt launch for visibility
4. ✅ Organic content marketing
5. ✅ Iterate based on feedback

Remember: Quality > Quantity. Build a product people love, and growth will follow.
