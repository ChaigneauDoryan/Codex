import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: userBookId } = await params;
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from('book_summaries') // Assuming a table for general book summaries
      .select('*')
      .eq('user_book_id', userBookId)
      .single();

    if (error) {
      console.error('Error fetching book summary:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch book summary' }), { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching book summary:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: userBookId } = await params;
  const { summaryText } = await request.json();
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from('book_summaries') // Assuming a table for general book summaries
      .insert({
        user_book_id: userBookId,
        summary_text: summaryText,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting book summary:', error);
      return new Response(JSON.stringify({ error: 'Failed to insert book summary' }), { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error inserting book summary:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}