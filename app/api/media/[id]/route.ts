import { NextResponse } from 'next/server';
import { db } from '@/db';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Nieprawidłowe ID' }, { status: 400 });
    }
    
    const [prompt] = await db.select()
      .from(links)
      .where(eq(links.id, id));
    
    if (!prompt || !prompt.imageData || !prompt.imageMimeType) {
      return NextResponse.json({ error: 'Obraz nie został znaleziony' }, { status: 404 });
    }
    
    // Konwertuj base64 na bufor
    const imageBuffer = Buffer.from(prompt.imageData, 'base64');
    
    // Zwróć obraz z odpowiednim typem MIME
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': prompt.imageMimeType,
        'Cache-Control': 'public, max-age=31536000',
        'Content-Length': imageBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Błąd podczas pobierania obrazu:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania obrazu' },
      { status: 500 }
    );
  }
}
