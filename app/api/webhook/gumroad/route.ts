import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const secret = process.env.GUMROAD_WEBHOOK_SECRET;
    const xWebhookSecret = request.headers.get('X-CI-WEBHOOK-SECRET');

    if (!secret) {
        return NextResponse.json({ error: 'Service Unavailable' }, { status: 503 });
    }

    if (xWebhookSecret !== secret) {
        return NextResponse.json({ error: 'Invalid Webhook Secret' }, { status: 403 });
    }

    const body = await request.json();
    const { passthrough } = body;

    // Parse and validate passthrough, then lock/seal in Supabase
    // Assuming you have imported your supabase client and helper functions
    await lockArtifactInSupabase(passthrough);

    return NextResponse.json({ success: true });
}