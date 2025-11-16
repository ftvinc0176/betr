import { NextRequest, NextResponse } from 'next/server';

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
                text: 'You are an expert image editor. I will provide you with two images: 1) A front license ID photo, and 2) A selfie photo. Please create a composite/edited image that realistically shows the user holding their ID document up to their face in the selfie. The composite should look natural and realistic.',
              },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: idPhotoBase64,
                },
              },
              {
                text: 'This is the selfie photo where I need you to add the ID being held up.',
              },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: selfiePhotoBase64,
                },
              },
              {
                text: 'Create and return the composite image as base64 PNG data.',
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
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
    
    console.log('Generated content received, length:', generatedContent?.length);

    // Try to extract base64 image from response
    let compositePhotoData = null;
    if (generatedContent) {
      // Look for base64 data in the response
      const base64Match = generatedContent.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)|base64[,:]([A-Za-z0-9+/=]+)/);
      if (base64Match) {
        const base64Data = base64Match[1] || base64Match[2];
        compositePhotoData = `data:image/png;base64,${base64Data}`;
        console.log('Extracted base64 image, length:', base64Data.length);
      } else {
        console.log('No base64 data found in response');
        console.log('Response preview:', generatedContent.substring(0, 200));
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Composite photo generated successfully',
      compositePhoto: compositePhotoData || generatedContent, // Return the full response if no image found
    });
  } catch (error) {
    console.error('Error generating composite image:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
