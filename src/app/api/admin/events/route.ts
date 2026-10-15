import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { CLUB_EVENT_TYPES, type ClubEventType } from '@/types/calendar';
import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

interface EventInput {
  title?: string;
  type?: string;
  starts_at?: string;
  ends_at?: string | null;
  all_day?: boolean;
  location?: string | null;
  description?: string | null;
}

type Body = { secret?: string; id?: string; event?: EventInput };

function validateEvent(input: EventInput | undefined) {
  if (!input) return { error: '일정 정보가 없습니다.' } as const;
  const title = input.title?.trim();
  if (!title) return { error: '제목을 입력하세요.' } as const;
  if (!CLUB_EVENT_TYPES.includes(input.type as ClubEventType)) {
    return { error: '일정 종류가 올바르지 않습니다.' } as const;
  }
  const startsAt = input.starts_at ? new Date(input.starts_at) : null;
  if (!startsAt || Number.isNaN(startsAt.getTime())) {
    return { error: '시작 일시가 올바르지 않습니다.' } as const;
  }
  const endsAt = input.ends_at ? new Date(input.ends_at) : null;
  if (endsAt && (Number.isNaN(endsAt.getTime()) || endsAt < startsAt)) {
    return { error: '종료 일시가 시작 일시보다 빠릅니다.' } as const;
  }

  return {
    value: {
      title,
      type: input.type as ClubEventType,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt ? endsAt.toISOString() : null,
      all_day: Boolean(input.all_day),
      location: input.location?.trim() || null,
      description: input.description?.trim() || null,
    },
  } as const;
}

async function authorize(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Body;
  if (!ADMIN_SECRET || body.secret !== ADMIN_SECRET) {
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

  const parsed = validateEvent(auth.body.event);
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

  const parsed = validateEvent(auth.body.event);
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
