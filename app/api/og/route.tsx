import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

/**
 * Dynamic OG image generator for Ci Moment artifacts.
 *
 * Query parameters:
 * - status: The artifact status (PROCEED, HOLD, NOT NOW)
 * - code: The artifact code (e.g., ci-7a-3f2e1)
 * - context: The context (career, love, timing)
 *
 * Example: /api/og?status=PROCEED&code=ci-7a-3f2e1&context=career
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status') || 'PROCEED';
    const code = searchParams.get('code') || 'ci-xx-xxxxx';
    const context = searchParams.get('context') || 'moment';

    // Status color mapping
    const statusColors: Record<string, string> = {
      'PROCEED': '#c8d8c0',
      'HOLD': '#d8d0b8',
      'NOT NOW': '#b8b8b8',
    };

    const statusColor = statusColors[status] || '#d4d4d4';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            fontFamily: 'monospace',
            position: 'relative',
          }}
        >
          {/* Background pattern (subtle grid) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(68, 68, 68, 0.15) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Card container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '800px',
              height: '500px',
              backgroundColor: '#0a0a0a',
              border: '2px solid #444',
              borderRadius: '24px',
              padding: '60px',
              position: 'relative',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* Holographic gradient overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(255, 110, 199, 0.1), rgba(126, 200, 255, 0.1), rgba(255, 228, 126, 0.1))',
                borderRadius: '24px',
                pointerEvents: 'none',
              }}
            />

            {/* Content */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {/* Header */}
              <div
                style={{
                  fontSize: '24px',
                  color: '#333',
                  letterSpacing: '0.3em',
                  marginBottom: '40px',
                  textTransform: 'uppercase',
                }}
              >
                CI MOMENT • ARTIFACT
              </div>

              {/* Status */}
              <div
                style={{
                  fontSize: '96px',
                  fontWeight: 200,
                  letterSpacing: '0.15em',
                  color: statusColor,
                  marginBottom: '40px',
                  textTransform: 'uppercase',
                }}
              >
                {status}
              </div>

              {/* Info */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '24px',
                  color: '#444',
                }}
              >
                <div>ID: {code}</div>
                <div style={{ textTransform: 'capitalize' }}>{context}</div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                fontSize: '20px',
                color: '#333',
                borderTop: '1px solid #1a1a1a',
                paddingTop: '20px',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div style={{ letterSpacing: '0.1em' }}>LOCKED TO MOMENT</div>
              <div>ci-moment.vercel.app</div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error('OG image generation error:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
