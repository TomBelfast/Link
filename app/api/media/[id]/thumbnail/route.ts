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
    console.log(`Pobieranie miniatury dla ID: ${id}`);
    
    if (isNaN(id)) {
      console.error('Nieprawidłowe ID:', params.id);
      return NextResponse.json({ error: 'Nieprawidłowe ID' }, { status: 400 });
    }
    
    const [prompt] = await db.select()
      .from(links)
      .where(eq(links.id, id));
    
    if (!prompt) {
      console.error(`Nie znaleziono promptu o ID: ${id}`);
      return NextResponse.json({ error: 'Prompt nie został znaleziony' }, { status: 404 });
    }

    if (!prompt.thumbnailData || !prompt.thumbnailMimeType) {
      console.error(`Brak danych miniatury dla promptu ID: ${id}`);
      return NextResponse.json({ error: 'Miniaturka nie została znaleziona' }, { status: 404 });
    }
    
    let imageBuffer;
    try {
      // Konwertuj dane binarne na string
      const thumbnailString = prompt.thumbnailData.toString('binary');
      
      // Sprawdź format danych
      const isBase64WithPrefix = thumbnailString.startsWith('data:');
      const isBase64 = /^[A-Za-z0-9+/=]+$/.test(thumbnailString);
      
      console.log(`Analiza danych miniatury dla ID: ${id}`, {
        mimeType: prompt.thumbnailMimeType,
        dataLength: thumbnailString.length,
        isBase64WithPrefix,
        isBase64,
        sampleStart: thumbnailString.substring(0, 50)
      });

      if (isBase64WithPrefix) {
        // Dane z prefixem data:image/*;base64,
        const base64Data = thumbnailString.split(',')[1];
        imageBuffer = Buffer.from(base64Data, 'base64');
      } else if (isBase64) {
        // Czyste dane base64
        imageBuffer = Buffer.from(thumbnailString, 'base64');
      } else {
        // Dane binarne
        imageBuffer = Buffer.from(thumbnailString, 'binary');
      }
      
      console.log('Pomyślnie utworzono bufor obrazu:', {
        bufferLength: imageBuffer.length,
        isBuffer: Buffer.isBuffer(imageBuffer)
      });

      // Zwróć miniaturkę z odpowiednimi nagłówkami
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': prompt.thumbnailMimeType,
          'Cache-Control': 'public, max-age=31536000',
          'Content-Length': imageBuffer.length.toString(),
          'Accept-Ranges': 'bytes',
          'X-Content-Type-Options': 'nosniff'
        },
      });
    } catch (error) {
      console.error('Błąd podczas konwersji danych obrazu:', error);
      console.error('Dane wejściowe:', {
        dataLength: prompt.thumbnailData.length,
        sampleStart: thumbnailString?.substring(0, 50),
        mimeType: prompt.thumbnailMimeType,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return NextResponse.json(
        { error: 'Błąd podczas przetwarzania danych obrazu' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Błąd podczas pobierania miniatury:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania miniaturki' },
      { status: 500 }
    );
  }
}
