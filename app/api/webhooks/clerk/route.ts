import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const clerkWebhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  const payload = await req.text();
  const hdrs = headers();
  const svixId = (await hdrs).get('svix-id');
  const svixTimestamp = (await hdrs).get('svix-timestamp');
  const svixSignature = (await hdrs).get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing Svix headers' }, { status: 400 });
  }

  let evt: any;
  try {
    const wh = new Webhook(clerkWebhookSecret);
    evt = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const { type, data } = evt;

  if (type === 'user.deleted') {
    const clerkId = data?.id as string | undefined;
    if (clerkId) {
      // Delete the user row; FK ON DELETE CASCADE cleans up related rows.
      const { error } = await supabase.from('users').delete().eq('clerk_id', clerkId);
      if (error) {
        return NextResponse.json({ error: 'Supabase delete failed' }, { status: 500 });
      }
    }
  }

  // Optional: keep email in sync on updates
  if (type === 'user.updated') {
    const clerkId = data?.id as string | undefined;
    const email = data?.email_addresses?.[0]?.email_address as string | undefined;
    if (clerkId && email) {
      await supabase.from('users').update({ email }).eq('clerk_id', clerkId);
    }
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}