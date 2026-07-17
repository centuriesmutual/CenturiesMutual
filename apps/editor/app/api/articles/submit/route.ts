import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, requireRole } from '@/lib/middleware';
import { uploadFileToBox, createFolder } from '@/lib/box';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const user = authMiddleware(request);
    if (user instanceof NextResponse) {
      return user;
    }

    requireRole(user, ['admin', 'editor']);

    const body = await request.json();
    const { title, content, author, category, tags, images, publishDate } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Create article folder in Box
    const articlesFolderName = `Article_${Date.now()}_${title.replace(/[^a-z0-9]/gi, '_')}`;
    const articlesFolder = await createFolder(articlesFolderName, '0');

    // Upload article content as markdown file
    const articleContent = `# ${title}\n\n**Author:** ${author || user.name}\n**Category:** ${category || 'General'}\n**Tags:** ${tags?.join(', ') || 'none'}\n**Publish Date:** ${publishDate || new Date().toISOString()}\n\n---\n\n${content}`;
    
    const articleFile = await uploadFileToBox(
      `${title.replace(/[^a-z0-9]/gi, '_')}.md`,
      Buffer.from(articleContent, 'utf-8'),
      articlesFolder.id
    );

    // Upload images if provided
    const uploadedImages: string[] = [];
    if (images && Array.isArray(images)) {
      for (const image of images) {
        if (image.base64) {
          const imageBuffer = Buffer.from(image.base64, 'base64');
          const imageFile = await uploadFileToBox(
            image.filename || `image_${Date.now()}.jpg`,
            imageBuffer,
            articlesFolder.id
          );
          uploadedImages.push(imageFile.id);
        }
      }
    }

    // Submit article to newspaper domain
    const newspaperDomain = process.env.NEWSPAPER_DOMAIN || 'newspaper.centuriesmutual.com';
    
    try {
      const submissionResponse = await axios.post(
        `https://${newspaperDomain}/api/articles`,
        {
          title,
          content,
          author: author || user.name,
          category: category || 'General',
          tags: tags || [],
          boxFolderId: articlesFolder.id,
          boxFileId: articleFile.id,
          images: uploadedImages,
          publishDate: publishDate || new Date().toISOString(),
          submittedBy: user.email,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            // Add any required authentication headers here
          },
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Article submitted successfully',
        article: {
          id: articleFile.id,
          title,
          boxFolderId: articlesFolder.id,
          boxFileId: articleFile.id,
          submissionResponse: submissionResponse.data,
        },
      });
    } catch (submissionError: any) {
      // If submission fails, still return success with Box upload info
      console.error('Error submitting to newspaper domain:', submissionError);
      
      return NextResponse.json({
        success: true,
        message: 'Article uploaded to Box, but submission to newspaper domain failed',
        warning: submissionError.message,
        article: {
          id: articleFile.id,
          title,
          boxFolderId: articlesFolder.id,
          boxFileId: articleFile.id,
        },
      }, { status: 207 }); // 207 Multi-Status
    }
  } catch (error: any) {
    console.error('Article submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Insufficient permissions' ? 403 : 500 }
    );
  }
}

