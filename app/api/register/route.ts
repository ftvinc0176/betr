import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { fullName, dateOfBirth, socialSecurityNumber, address, email, password, confirmPassword } = await request.json();

    // Validation
    if (!fullName || !dateOfBirth || !socialSecurityNumber || !address || !email || !password) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      fullName,
      dateOfBirth: new Date(dateOfBirth),
      socialSecurityNumber,
      address,
      email,
      password,
    });

    // Log to console for visibility
    console.log('New User Registered:', {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
