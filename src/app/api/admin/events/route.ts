import {
  isAdminSecret,
  validateClubEvent,
  type ClubEventInput,
} from '@/lib/club-events-server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

type Body = { secret?: string; id?: string; event?: ClubEventInput };

async function authorize(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Body;
  if (!isAdminSecret(body.secret)) {
    return {
      response: NextResponse.json({ error: '인증 실패' }, { status: 401 }),
    } as const;
  }
  const db = getSupabaseAdmin();
  if (!db) {
    return {
      response: NextResponse.json(
        { error: 'SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.' },
        { status: 500 },
      ),
    } as const;
  }
  return { body, db } as const;
}

function done(data: unknown) {
  revalidatePath('/calendar', 'layout');
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  const auth = await authorize(req);
  if ('response' in auth) return auth.response;

  const parsed = validateClubEvent(auth.body.event);
  if ('error' in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { data, error } = await auth.db
    .from('club_events')
    .insert(parsed.value)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return done(data);
}

export async function PATCH(req: NextRequest) {
  const auth = await authorize(req);
  if ('response' in auth) return auth.response;
  if (!auth.body.id) {
    return NextResponse.json({ error: 'id가 필요합니다.' }, { status: 400 });
  }

  const parsed = validateClubEvent(auth.body.event);
  if ('error' in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { data, error } = await auth.db
    .from('club_events')
    .update(parsed.value)
    .eq('id', auth.body.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return done(data);
}

export async function DELETE(req: NextRequest) {
  const auth = await authorize(req);
  if ('response' in auth) return auth.response;
  if (!auth.body.id) {
    return NextResponse.json({ error: 'id가 필요합니다.' }, { status: 400 });
  }

  const { error } = await auth.db
    .from('club_events')
    .delete()
    .eq('id', auth.body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return done(null);
}
