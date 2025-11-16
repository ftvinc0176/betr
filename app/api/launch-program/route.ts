import { NextRequest, NextResponse } from 'next/server';
import { spawn, execSync } from 'child_process';
import { existsSync } from 'fs';
import { dirname } from 'path';

// Function to resolve Windows shortcut (.lnk) files
async function resolveShortcut(shortcutPath: string): Promise<string> {
  try {
    // Use PowerShell to resolve the shortcut target
    const psCommand = `(New-Object -ComObject WScript.Shell).CreateShortcut('${shortcutPath}').TargetPath`;
    const result = execSync(`powershell -Command "${psCommand}"`, { encoding: 'utf-8' });
    return result.trim();
  } catch (error) {
    console.error('Failed to resolve shortcut:', error);
    throw new Error(`Could not resolve shortcut: ${shortcutPath}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { programPath } = body;
    const { userId, userName } = body;

    if (!programPath) {
      return NextResponse.json(
        { error: 'Program path is required' },
        { status: 400 }
      );
    }

    console.log('Attempting to launch program:', programPath, 'for user:', userName);

    // If it's a shortcut file (.lnk), resolve it to the actual executable
    if (programPath.toLowerCase().endsWith('.lnk')) {
      if (existsSync(programPath)) {
        console.log('Resolving shortcut:', programPath);
        try {
          programPath = await resolveShortcut(programPath);
          console.log('Resolved to:', programPath);
        } catch (error) {
          console.error('Failed to resolve shortcut:', error);
          return NextResponse.json(
            { error: `Failed to resolve shortcut: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
          );
        }
      }
    }

    // Check if the file exists
    if (!existsSync(programPath)) {
      console.error('Program not found at:', programPath);
      return NextResponse.json(
        { error: `Program not found at: ${programPath}` },
        { status: 404 }
      );
    }

    // Get the directory of the executable for working directory
    const workingDir = dirname(programPath);

    console.log('Launching from directory:', workingDir);
    console.log('Full path:', programPath);

    // Launch using cmd.exe with START command for better Windows compatibility
    const child = spawn('cmd.exe', ['/c', `start "" "${programPath}"`], {
      detached: true,
      stdio: 'ignore',
      shell: false,
      cwd: workingDir,
      env: {
        ...process.env,
        USER_ID: userId || '',
        USER_NAME: userName || '',
      },
    });

    // Don't wait for the process to exit
    child.unref();

    console.log('Program launched successfully:', programPath);

    return NextResponse.json({
      success: true,
      message: `Program launched: ${programPath}`,
      resolvedPath: programPath,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { 
        error: `Failed to launch program: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error instanceof Error ? error.toString() : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
