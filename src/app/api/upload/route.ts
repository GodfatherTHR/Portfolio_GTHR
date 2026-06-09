import { NextResponse } from 'next/server';
import multer from 'multer';
import cloudinary from '@/lib/cloudinary';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic'

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const handleUpload = async (file: Express.Multer.File) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result);
        }
      }
    );
    const readableStream = new Readable();
    readableStream._read = () => {};
    readableStream.push(file.buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded.' }, { status: 400 });
    }
    
    // Convert Web API File to something Express/Multer understands
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    const mockMulterFile = {
      buffer,
      originalname: file.name,
      mimetype: file.type,
      size: file.size,
      fieldname: 'file',
      encoding: 'utf8',
      stream: new Readable(), // dummy stream
      destination: '', // dummy
      filename: '', // dummy
      path: '' // dummy
    };

    const result: any = await handleUpload(mockMulterFile);

    return NextResponse.json({ success: true, url: result.secure_url });

  } catch (error) {
    console.error('Upload API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during upload.';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
