import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { collection: string; id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const collection = db.collection(params.collection);
    const data = await collection.findOne({ _id: new ObjectId(params.id) });

    if (!data) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error('Document query error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { collection: string; id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const db = await getDatabase();
    const collection = db.collection(params.collection);

    const result = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { ...body, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Document updated' }, { status: 200 });
  } catch (error: any) {
    console.error('Document update error:', error);
    return NextResponse.json(
      { error: 'Failed to update document', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { collection: string; id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const collection = db.collection(params.collection);
    const result = await collection.deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Document deleted' }, { status: 200 });
  } catch (error: any) {
    console.error('Document delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete document', details: error.message },
      { status: 500 }
    );
  }
}
