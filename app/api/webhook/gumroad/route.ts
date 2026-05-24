import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { isSupabaseConfigured, sealArtifactByHash } from '@/lib/supabase';
import { hashNameToIndex, resolveAtlasBindings } from '@/lib/engine';
import { LEGEND_ATLAS } from '@/lib/legend-atlas';
import { prisma } from '@/lib/db';

/**
 * Gumroad webhook handler for processing sale events.
 * 
 * Expected payload:
 * {
 *   "sale_id": "string",
 *   "custom_fields": {
 *     "Your Name": "sender",
 *     "Receiver Name": "receiver"
 *   }
 * }
 * 
 * Generates deterministic indices mapping sender/receiver to LEGEND_ATLAS.
 * Stores sale_id and indices in database.
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Extract required fields
    const saleId = payload.sale_id;
    const senderName = payload.custom_fields?.['Your Name'];
    const receiverName = payload.custom_fields?.['Receiver Name'];

    // Validate required fields
    if (!saleId || !senderName || !receiverName) {
      return NextResponse.json(
        {
          error: 'Missing required fields: sale_id, custom_fields["Your Name"], custom_fields["Receiver Name"]',
        },
        { status: 400 }
      );
    }

    // Generate deterministic indices
    const senderElementIndex = hashNameToIndex(senderName, 'elements');
    const receiverLogicIndex = hashNameToIndex(receiverName, 'logic');
    const celestialIndex = senderElementIndex % LEGEND_ATLAS.celestial.length;

    // Create verification hash for artifact tracking
    const verifyHash = createHash('sha256')
      .update(`${saleId}:${senderName}:${receiverName}`)
      .digest('hex');

    // Prepare cipher data
    const cipherData = {
      sale_id: saleId,
      sender_name: senderName,
      receiver_name: receiverName,
      element_index: senderElementIndex,
      celestial_index: celestialIndex,
      logic_index: receiverLogicIndex,
      verify_hash: verifyHash,
      created_at: new Date().toISOString(),
    };

    // Save to database using Prisma (primary) or Supabase fallback
    let saved = false;
    let dbResponse: any = null;

    try {
      // Try Prisma first
      dbResponse = await prisma.sale.create({
        data: cipherData,
      });
      saved = true;
    } catch (prismaError) {
      // Fallback to Supabase if Prisma fails
      if (isSupabaseConfigured()) {
        try {
          const { createClient } = await import('@supabase/supabase-js');
          const supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_KEY!
          );
          const { data, error } = await supabase
            .from('sales')
            .insert([cipherData])
            .select()
            .single();

          if (error) {
            throw error;
          }
          dbResponse = data;
          saved = true;
        } catch (supabaseError) {
          console.error('Supabase fallback failed:', supabaseError);
        }
      }
    }

    if (!saved) {
      return NextResponse.json(
        {
          error: 'Failed to save sale data to database',
          details: dbResponse?.message || 'Unknown error',
        },
        { status: 500 }
      );
    }

    // Return success with cipher indices for client-side reveal
    return NextResponse.json(
      {
        success: true,
        sale_id: saleId,
        verify_hash: verifyHash,
        cipher: {
          element_index: senderElementIndex,
          celestial_index: celestialIndex,
          logic_index: receiverLogicIndex,
          element: LEGEND_ATLAS.elements[senderElementIndex],
          celestial: LEGEND_ATLAS.celestial[celestialIndex],
          logic: LEGEND_ATLAS.logic[receiverLogicIndex],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Gumroad webhook error:', error);
    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}