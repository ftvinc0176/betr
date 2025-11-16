import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get all users who have all three photos but no composite photo yet
    const users = await User.find({
      idFrontPhoto: { $exists: true, $ne: null },
      idBackPhoto: { $exists: true, $ne: null },
      selfiePhoto: { $exists: true, $ne: null },
      $or: [
        { compositePhoto: { $exists: false } },
        { compositePhoto: null },
      ],
    });

    console.log(`Found ${users.length} users needing composite photo generation`);

    let successCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        // Extract base64 from data URLs
        const frontPhotoData = user.idFrontPhoto as string;
        const selfiePhotoData = user.selfiePhoto as string;

        const frontBase64 = frontPhotoData.includes(',')
          ? frontPhotoData.split(',')[1]
          : frontPhotoData;
        const selfieBase64 = selfiePhotoData.includes(',')
          ? selfiePhotoData.split(',')[1]
          : selfiePhotoData;

        // Convert base64 images to buffers
        const frontPhotoBuffer = Buffer.from(frontBase64, 'base64');
        const selfiePhotoBuffer = Buffer.from(selfieBase64, 'base64');

        // Get metadata for sizing
        const frontMetadata = await sharp(frontPhotoBuffer).metadata();
        const selfieMetadata = await sharp(selfiePhotoBuffer).metadata();

        console.log(`Processing user ${user._id}: Front ${frontMetadata.width}x${frontMetadata.height}, Selfie ${selfieMetadata.width}x${selfieMetadata.height}`);

        // Resize front ID to be about 30% of the selfie width
        const idResizeWidth = Math.floor((selfieMetadata.width || 1000) * 0.3);

        // Resize ID photo and convert to PNG for overlay
        const idResized = await sharp(frontPhotoBuffer)
          .resize(
            idResizeWidth,
            Math.floor(
              (idResizeWidth * (frontMetadata.height || 1)) /
                (frontMetadata.width || 1)
            ),
            {
              fit: 'contain',
              background: { r: 0, g: 0, b: 0, alpha: 0 },
            }
          )
          .png()
          .toBuffer();

        // Create composite: place ID in upper-right area of selfie
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
        await User.findByIdAndUpdate(
          user._id,
          { compositePhoto: compositePhotoData },
          { new: true }
        );

        console.log(`✓ Generated composite for user ${user._id}`);
        successCount++;
      } catch (error) {
        console.error(`✗ Error generating composite for user ${user._id}:`, error);
        errorCount++;
      }
    }

    return NextResponse.json(
      {
        message: 'Migration completed',
        processed: users.length,
        successful: successCount,
        failed: errorCount,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
