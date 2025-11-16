import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Fetch all users sorted by most recent first
    // Use select('+password') to include password field which is normally excluded
    const users = await User.find({})
      .select('+password')
      .sort({ createdAt: -1 })
      .lean();

    console.log('Admin registrations fetch:', {
      count: users.length,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: 'Registrations fetched successfully',
        users: users,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Admin registrations fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const result = await User.findByIdAndDelete(userId);

    if (!result) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('User deleted:', {
      userId,
      email: result.email,
      fullName: result.fullName,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: 'User deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Admin user deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
