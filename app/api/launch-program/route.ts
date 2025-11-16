import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { programPath, userId, userName } = await request.json();

    if (!programPath) {
      return NextResponse.json(
        { error: 'Program path is required' },
        { status: 400 }
      );
    }

    console.log('Launching program:', programPath, 'for user:', userName);

    // Launch the program with user data as environment variables
    const env = {
      ...process.env,
      USER_ID: userId,
      USER_NAME: userName,
    };

    // Execute the program asynchronously without waiting
    exec(`"${programPath}"`, { env }, (error, stdout, stderr) => {
      if (error) {
        console.error('Program launch error:', error);
      }
      if (stdout) {
        console.log('Program output:', stdout);
      }
    });

    return NextResponse.json({
      success: true,
      message: `Program launched: ${programPath}`,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: `Failed to launch program: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
