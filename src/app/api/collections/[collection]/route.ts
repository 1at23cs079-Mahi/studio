import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { collection: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');
    const sort = searchParams.get('sort');
    const limit = searchParams.get('limit');

    const db = await getDatabase();
    const collection = db.collection(params.collection);

    let query = collection.find(filter ? JSON.parse(filter) : {});

    if (sort) {
      query = query.sort(JSON.parse(sort));
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const data = await query.toArray();

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error('Collection query error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { collection: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const db = await getDatabase();
    const collection = db.collection(params.collection);

    const result = await collection.insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { id: result.insertedId, message: 'Document created' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Collection create error:', error);
    return NextResponse.json(
      { error: 'Failed to create document', details: error.message },
      { status: 500 }
    );
  }
}
