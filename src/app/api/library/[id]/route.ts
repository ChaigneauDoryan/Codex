import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserBookById } from '@/lib/book-utils';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const userBook = await getUserBookById(supabase, id, user.id);
    if (!userBook) {
      return new Response(JSON.stringify({ error: 'Book not found' }), { status: 404 });
    }
    return NextResponse.json(userBook);
  } catch (error) {
    console.error('Error fetching book details:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { error } = await supabase
      .from('user_books')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting book:', error);
      return new Response(JSON.stringify({ error: 'Failed to delete book' }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Book deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting book:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { is_archived } = await request.json();
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from('user_books')
      .update({ is_archived })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating book archive status:', error);
      return new Response(JSON.stringify({ error: 'Failed to update book' }), { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating book:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}