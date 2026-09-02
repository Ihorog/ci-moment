import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const artifactCode = formData.get('custom_fields[artifactCode]') as string;

    if (!artifactCode) {
      return NextResponse.json({ error: 'Artifact code missing' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('MomentArtifact')
      .update({
        sealed: true,
        sealedAt: new Date().toISOString(),
        status: 'AUTHORIZED'
      })
      .eq('artifactCode', artifactCode)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, artifact: data });
  } catch {
    return NextResponse.json({ error: 'Seal failed' }, { status: 500 });
  }
}
