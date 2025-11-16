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
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Extract base64 from data URLs
    const idPhotoBase64 = idFrontPhotoUrl.includes(',') ? idFrontPhotoUrl.split(',')[1] : idFrontPhotoUrl;
    const selfiePhotoBase64 = selfiePhotoUrl.includes(',') ? selfiePhotoUrl.split(',')[1] : selfiePhotoUrl;

    // Call Gemini API with vision capabilities to analyze and describe the composite
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
                text: 'You are an AI image editor. I will provide you with two images: 1) A front license ID photo, and 2) A selfie photo. Your task is to create a composite/edited image that shows the user holding their ID document up in the selfie. The composite should look realistic and natural. Important: You must generate and return the actual image as a base64-encoded PNG image.',
              },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: idPhotoBase64,
                },
              },
              {
                text: 'This is the selfie photo where we need to add the ID.',
              },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: selfiePhotoBase64,
                },
              },
              {
                text: 'Now create a composite image showing the user holding the ID up in the selfie. Return the result as a base64-encoded image.',
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

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return NextResponse.json(
        { error: 'Failed to generate composite image' },
        { status: response.status }
      );
    }

    const generatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    console.log('Generated composite response:', generatedContent?.substring(0, 100));

    // Try to extract base64 image from response
    let compositePhotoData = null;
    if (generatedContent) {
      // Look for base64 data in the response
      const base64Match = generatedContent.match(/base64[,:]([A-Za-z0-9+/=]+)/);
      if (base64Match) {
        compositePhotoData = `data:image/png;base64,${base64Match[1]}`;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Composite photo generated successfully',
      compositePhoto: compositePhotoData,
      generatedContent: generatedContent,
    });
  } catch (error) {
    console.error('Error generating composite image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
