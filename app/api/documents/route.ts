
import { NextRequest, NextResponse } from 'next/server';
import { getDocuments } from '@/app/actions/document-actions';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const consultantId = searchParams.get('consultantId');

    const documents = await getDocuments(consultantId || undefined);
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error in documents API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
