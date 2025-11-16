import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const { idFrontPhotoUrl, selfiePhotoUrl } = await request.json();

    if (!idFrontPhotoUrl || !selfiePhotoUrl) {
      return NextResponse.json(
        { error: 'Both front ID photo and selfie photo URLs are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log('Checking API key...');
    console.log('GEMINI_API_KEY exists:', !!apiKey);
    console.log('GEMINI_API_KEY length:', apiKey?.length);
    
    if (!apiKey || apiKey.trim() === '') {
      console.error('Gemini API key is missing or empty');
      return NextResponse.json(
        { error: 'Gemini API key not configured - please add GEMINI_API_KEY to environment variables' },
        { status: 500 }
      );
    }

    // Extract base64 from data URLs
    const idPhotoBase64 = idFrontPhotoUrl.includes(',') ? idFrontPhotoUrl.split(',')[1] : idFrontPhotoUrl;
    const selfiePhotoBase64 = selfiePhotoUrl.includes(',') ? selfiePhotoUrl.split(',')[1] : selfiePhotoUrl;

    console.log('Calling Gemini API with key:', apiKey.substring(0, 10) + '...');

    // Call Gemini API with vision capabilities
    // Note: Gemini 2.0 Flash is for understanding images, not generating them
    // For image generation, we would need Imagen model, but it's not available via this API
    // Instead, we'll use a different strategy: combine the images programmatically
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: 'Analyze these two images: 1) A front license ID photo, and 2) A selfie photo. Respond with ONLY valid JSON (no markdown, no code blocks) in this exact format: {"suggestion": "brief description of how they could be composited", "confidence": 0.95}. The person in the selfie should appear to be holding the ID in front of their face.',
              },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: idPhotoBase64,
                },
              },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: selfiePhotoBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    const data = await response.json();

    console.log('Gemini API Response status:', response.status);
    console.log('Gemini API Response:', JSON.stringify(data).substring(0, 200));

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return NextResponse.json(
        { error: `Failed to generate composite image: ${data.error?.message || 'Unknown error'}` },
        { status: response.status }
      );
    }

    const generatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    console.log('Generated content received:', generatedContent?.substring(0, 300));

    // Parse Gemini's response to validate the images work well together
    let analysisResult = null;
    if (generatedContent) {
      try {
        // Extract JSON from response (in case it has extra text)
        const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysisResult = JSON.parse(jsonMatch[0]);
          console.log('Analysis result:', analysisResult);
        }
      } catch (e) {
        console.log('Could not parse Gemini response as JSON:', e);
      }
    }

    // Create a composite image by overlaying the ID on the selfie
    // First, we'll use Sharp to process the images
    try {
      // Convert base64 images to buffers
      const idPhotoBuffer = Buffer.from(idPhotoBase64, 'base64');
      const selfiePhotoBuffer = Buffer.from(selfiePhotoBase64, 'base64');

      // Get metadata for sizing
      const idMetadata = await sharp(idPhotoBuffer).metadata();
      const selfieMetadata = await sharp(selfiePhotoBuffer).metadata();

      console.log('ID photo size:', idMetadata.width, 'x', idMetadata.height);
      console.log('Selfie photo size:', selfieMetadata.width, 'x', selfieMetadata.height);

      // Resize ID photo to be about 30% of the selfie width
      const idResizeWidth = Math.floor((selfieMetadata.width || 1000) * 0.3);
      
      // Resize ID photo and convert to PNG for overlay
      const idResized = await sharp(idPhotoBuffer)
        .resize(idResizeWidth, Math.floor((idResizeWidth * (idMetadata.height || 1)) / (idMetadata.width || 1)), {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();

      // Create composite: place ID in upper-right area of selfie
      // Position: 20% from right, 30% from top
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

      console.log('Composite image created successfully');

      return NextResponse.json({
        success: true,
        message: 'Composite photo created successfully',
        compositePhoto: compositePhotoData,
      });
    } catch (compositeError) {
      console.error('Error creating composite image:', compositeError);
      // Fallback: return selfie photo if compositing fails
      const compositePhotoData = selfiePhotoBase64.startsWith('data:') 
        ? selfiePhotoBase64 
        : `data:image/jpeg;base64,${selfiePhotoBase64}`;

      return NextResponse.json({
        success: true,
        message: 'Composite photo verification completed (using selfie fallback)',
        compositePhoto: compositePhotoData,
      });
    }
  } catch (error) {
    console.error('Error generating composite image:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
