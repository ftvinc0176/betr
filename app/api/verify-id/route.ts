import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import sharp from 'sharp';

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

    // Auto-generate composite photo with all three photos now available
    try {
      console.log('Starting auto-generation of composite photo...');
      
      // Create composite: overlay front ID on selfie
      const frontPhotoBuffer = Buffer.from(frontBase64, 'base64');
      const selfiePhotoBuffer = Buffer.from(selfieBase64, 'base64');

      // Get metadata for sizing
      const frontMetadata = await sharp(frontPhotoBuffer).metadata();
      const selfieMetadata = await sharp(selfiePhotoBuffer).metadata();

      console.log('Front ID size:', frontMetadata.width, 'x', frontMetadata.height);
      console.log('Selfie size:', selfieMetadata.width, 'x', selfieMetadata.height);

      // Resize front ID to be about 30% of the selfie width
      const idResizeWidth = Math.floor((selfieMetadata.width || 1000) * 0.3);
      
      // Resize ID photo and convert to PNG for overlay
      const idResized = await sharp(frontPhotoBuffer)
        .resize(idResizeWidth, Math.floor((idResizeWidth * (frontMetadata.height || 1)) / (frontMetadata.width || 1)), {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();

      // Create composite: place ID in upper-right area of selfie
      // Position: 65% from left, 25% from top
      const offsetX = Math.floor((selfieMetadata.width || 1000) * 0.65);
      const offsetY = Math.floor((selfieMetadata.height || 1000) * 0.25);

      const compositeBuffer = await sharp(selfiePhotoBuffer)
        .composite([
          {
            input: idResized,
            left: offsetX,
            top: offsetY,
          },
        ])
        .jpeg({ quality: 90 })
        .toBuffer();

      // Convert composite to base64
      const compositeBase64 = compositeBuffer.toString('base64');
      const compositePhotoData = `data:image/jpeg;base64,${compositeBase64}`;

      // Save composite photo to user
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { compositePhoto: compositePhotoData },
        { new: true }
      );

      console.log('Composite photo auto-generated and saved:', {
        userId: user._id,
        compositePhotoSize: compositePhotoData.length,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        {
          message: 'ID photos uploaded successfully and composite photo auto-generated',
          verificationStatus: updatedUser?.verificationStatus,
          compositeGenerated: true,
        },
        { status: 200 }
      );
    } catch (compositeError) {
      console.error('Error auto-generating composite photo:', compositeError);
      // Still return success for photo upload, even if composite generation fails
      return NextResponse.json(
        {
          message: 'ID photos uploaded successfully (composite generation failed, but photos saved)',
          verificationStatus: user.verificationStatus,
          compositeGenerated: false,
        },
        { status: 200 }
      );
    }
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
