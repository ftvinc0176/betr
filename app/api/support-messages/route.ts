import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/User';
import connectDB from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { userId, message, sender } = await request.json();

    if (!userId || !message || !sender) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['user', 'support'].includes(sender)) {
      return NextResponse.json(
        { error: 'Invalid sender type' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Initialize supportMessages if it doesn't exist
    if (!user.supportMessages) {
      user.supportMessages = [];
    }

    // Add new message
    user.supportMessages.push({
      id: Date.now().toString(),
      sender: sender as 'user' | 'support',
      message,
      timestamp: new Date(),
    });

    await user.save();

    return NextResponse.json({
      success: true,
      messages: user.supportMessages,
    });
  } catch (error) {
    console.error('Error saving support message:', error);
    return NextResponse.json(
      { error: 'Failed to save message' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      messages: user.supportMessages || [],
    });
  } catch (error) {
    console.error('Error fetching support messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
