import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { fullName, dateOfBirth, socialSecurityNumber, address, email, phoneNumber, password } = body;

    console.log('=== REGISTER REQUEST ===');
    console.log('Body received:', body);
    console.log('Fields:', { fullName, dateOfBirth, socialSecurityNumber, address, email, phoneNumber, password });

    // Use provided values or defaults
    const userEmail = email || `tempuser_${Date.now()}@tempmail.com`;
    const userPassword = password || 'temp_password_123';
    
    // Create new user - no email uniqueness check, allow duplicates
    const user = await User.create({
      fullName: fullName || 'Not Provided',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date('2000-01-01'),
      socialSecurityNumber: socialSecurityNumber || '000000000',
      address: address || 'Not Provided',
      email: userEmail,
      phoneNumber: phoneNumber || '0000000000',
      password: userPassword,
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
