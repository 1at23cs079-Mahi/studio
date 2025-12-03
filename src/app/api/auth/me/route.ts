import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import { verifyToken, getTokenFromCookie } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    await connectDB();
    const user = await User.findById(payload.userId).select('-password');

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Auth check error:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
