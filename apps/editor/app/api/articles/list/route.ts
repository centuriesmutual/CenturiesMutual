import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/middleware';
import { getFolderContents } from '@/lib/box';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = authMiddleware(request);
    if (user instanceof NextResponse) {
      return user;
    }

    const folderId = request.nextUrl.searchParams.get('folderId') || '0';
    const contents = await getFolderContents(folderId);

    return NextResponse.json({
      success: true,
      items: contents.entries || [],
    });
  } catch (error: any) {
    console.error('Error listing articles:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

