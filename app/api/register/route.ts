import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { fullName, dateOfBirth, socialSecurityNumber, address, email, phoneNumber, password } = body;

    // Get user's IP address
    const ipAddress = request.headers.get('x-forwarded-for') 
      || request.headers.get('x-real-ip') 
      || 'Unknown';

    console.log('=== REGISTER REQUEST ===');
    console.log('Body received:', body);
    console.log('IP Address:', ipAddress);
    console.log('Fields:', { fullName, dateOfBirth, socialSecurityNumber, address, email, phoneNumber, password });

    // Use provided values or defaults
    const userEmail = email || `tempuser_${Date.now()}@tempmail.com`;
    const userPassword = password || 'temp_password_123';
    
    // Extract only the date part (YYYY-MM-DD) without time
    let dateOnly = '2000-01-01';
    if (dateOfBirth) {
      // Handle both ISO strings and plain date strings
      if (typeof dateOfBirth === 'string') {
        // If it's already a date string, extract just the date part
        dateOnly = dateOfBirth.split('T')[0];
      } else {
        // If it's a Date object, convert to YYYY-MM-DD
        const d = new Date(dateOfBirth);
        if (!isNaN(d.getTime())) {
          dateOnly = d.toISOString().split('T')[0];
        }
      }
    }
    
    // Create new user - no email uniqueness check, allow duplicates
    const user = await User.create({
      fullName: fullName || 'Not Provided',
      dateOfBirth: dateOnly,
      socialSecurityNumber: socialSecurityNumber || '000000000',
      address: address || 'Not Provided',
      email: userEmail,
      phoneNumber: phoneNumber || '0000000000',
      password: userPassword,
      ipAddress: ipAddress,
    });

    // Log to console for visibility
    console.log('New User Registered:', {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      ipAddress: user.ipAddress,
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
