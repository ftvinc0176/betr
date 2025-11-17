import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  try {
    console.log('[Admin API] Starting fetch...');
    
    console.log('[Admin API] Connecting to DB...');
    await connectDB();
    const connectElapsed = Date.now() - startTime;
    console.log(`[Admin API] DB connected in ${connectElapsed}ms`);

    // Fetch all users sorted by most recent first
    console.log('[Admin API] Querying users...');
    const queryStart = Date.now();
    
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .limit(1000)
      .exec();

    const queryElapsed = Date.now() - queryStart;
    const totalElapsed = Date.now() - startTime;
    
    console.log('Admin registrations fetch:', {
      count: users.length,
      queryTime: `${queryElapsed}ms`,
      totalTime: `${totalElapsed}ms`,
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
    const elapsed = Date.now() - startTime;
    console.error('Admin registrations fetch error:', {
      error: error instanceof Error ? error.message : String(error),
      elapsed: `${elapsed}ms`,
    });
    
    // Return empty array on timeout to avoid infinite loading
    if (error instanceof Error && (error.message.includes('timeout') || error.message.includes('Timeout'))) {
      return NextResponse.json(
        {
          message: 'Request timed out, returning empty results',
          users: [],
        },
        { status: 200 }
      );
    }
    
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

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, compositePhoto } = body;

    if (!userId || !compositePhoto) {
      return NextResponse.json(
        { error: 'User ID and composite photo are required' },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { compositePhoto },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('Composite photo saved:', {
      userId,
      email: updatedUser.email,
      photoLength: compositePhoto.length,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: 'Composite photo saved successfully',
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Admin composite photo save error:', error);
    return NextResponse.json(
      { error: 'Failed to save composite photo' },
      { status: 500 }
    );
  }
}
