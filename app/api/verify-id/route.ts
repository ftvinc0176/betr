import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const frontPhoto = formData.get('frontPhoto') as File;
    const backPhoto = formData.get('backPhoto') as File;
    const selfiePhoto = formData.get('selfiePhoto') as File;

    console.log('Verify ID Request - userId:', userId, 'frontPhoto:', frontPhoto?.name, 'backPhoto:', backPhoto?.name, 'selfiePhoto:', selfiePhoto?.name);

    if (!userId || userId === 'undefined' || !frontPhoto || !backPhoto || !selfiePhoto) {
      console.error('Missing or invalid fields:', { userId, frontPhoto: !!frontPhoto, backPhoto: !!backPhoto, selfiePhoto: !!selfiePhoto });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert files to base64 strings for storage in MongoDB
    const frontBuffer = await frontPhoto.arrayBuffer();
    const backBuffer = await backPhoto.arrayBuffer();
    const selfieBuffer = await selfiePhoto.arrayBuffer();
    
    const frontBase64 = Buffer.from(frontBuffer).toString('base64');
    const backBase64 = Buffer.from(backBuffer).toString('base64');
    const selfieBase64 = Buffer.from(selfieBuffer).toString('base64');

    // Add MIME type prefix for image reconstruction
    const frontPhotoData = `data:${frontPhoto.type};base64,${frontBase64}`;
    const backPhotoData = `data:${backPhoto.type};base64,${backBase64}`;
    const selfiePhotoData = `data:${selfiePhoto.type};base64,${selfieBase64}`;

    console.log('Files converted to base64, attempting to update user:', userId);

    // Update user with ID photos and selfie, set verification status to failed
    const user = await User.findByIdAndUpdate(
      userId,
      {
        idFrontPhoto: frontPhotoData,
        idBackPhoto: backPhotoData,
        selfiePhoto: selfiePhotoData,
        verificationStatus: 'failed',
      },
      { new: true }
    );

    console.log('Update result:', { found: !!user, userId, status: user?.verificationStatus });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('ID Photos Uploaded for User:', {
      userId: user._id,
      email: user.email,
      verificationStatus: user.verificationStatus,
      frontPhotoSize: frontPhotoData.length,
      backPhotoSize: backPhotoData.length,
      selfiePhotoSize: selfiePhotoData.length,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: 'ID photos uploaded successfully',
        verificationStatus: user.verificationStatus,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('ID verification upload error:', error);
    console.error('Error details:', errorMessage);
    return NextResponse.json(
      { error: `Failed to upload ID photos: ${errorMessage}` },
      { status: 500 }
    );
  }
}
