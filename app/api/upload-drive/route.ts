import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Disable body parser for very large base64 uploads if necessary, but app router natively supports it via Request
export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Unauthorized or missing Drive access token' }, { status: 401 });
    }

    const { imageBase64, filename } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Strip out the data:image/png;base64, part
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: session.accessToken });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    const fileMetadata = {
      name: filename || `bobabooth_${Date.now()}.png`,
      mimeType: 'image/png',
    };

    const media = {
      mimeType: 'image/png',
      body: ReadableStreamFromBuffer(buffer), 
    };

    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink',
    });

    const fileId = driveResponse.data.id;
    const downloadUrl = driveResponse.data.webContentLink;

    // Save metadata to database
    if (session.user?.id) {
       await prisma.photo.create({
           data: {
               userId: session.user.id,
               driveFileId: fileId,
               driveUrl: downloadUrl,
           }
       });
    }

    return NextResponse.json({
      success: true,
      fileId: fileId,
      downloadUrl: downloadUrl
    });
  } catch (error: any) {
    console.error('Drive upload error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

// polyfill buffer to readable stream for googleapis
import { Readable } from 'stream';
function ReadableStreamFromBuffer(buffer: Buffer) {
  const readable = new Readable();
  readable._read = () => {}; 
  readable.push(buffer);
  readable.push(null);
  return readable;
}
