import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validators';
import { AuthService } from '@/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validated = loginSchema.parse(body);

    // Login user
    const result = await AuthService.login(validated);

    // Set auth cookie
    const response = NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );

    response.cookies.set({
      name: 'auth_token',
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('Invalid credentials')) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
