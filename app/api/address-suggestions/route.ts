import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 3) {
      return NextResponse.json(
        { suggestions: [] },
        { status: 200 }
      );
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
    );
    
    const data = await response.json() as Array<{ display_name: string }>;
    const suggestions = data.map((item) => item.display_name);

    return NextResponse.json(
      { suggestions },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching address suggestions:', error);
    return NextResponse.json(
      { suggestions: [] },
      { status: 200 }
    );
  }
}
