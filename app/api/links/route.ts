import { NextResponse } from 'next/server';
import { db } from '@/db';
import { links } from '@/db/schema';
import { desc, eq, or } from 'drizzle-orm';
import { handleApiError, validateRequired } from '../error-handler';
import CacheManager from '@/lib/redis';
import { withRateLimit, rateLimiters } from '@/lib/rate-limiter';

export async function GET(request: Request) {
  const clientIP = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';

  return withRateLimit(clientIP, rateLimiters.api, async () => {
    try {
      const cacheKey = 'links:all';
      
      // Sprawdź cache
      const cachedLinks = await CacheManager.get(cacheKey);
      if (cachedLinks) {
        console.log('📦 Returning links from cache');
        return NextResponse.json(cachedLinks);
      }
      
      // Pobierz z bazy danych
      console.log('🔍 Fetching links from database');
      const allLinks = await db.select()
        .from(links)
        .orderBy(desc(links.createdAt));
      
      // Zapisz do cache na 5 minut
      await CacheManager.set(cacheKey, allLinks, 300);
      console.log(`💾 Cached ${allLinks.length} links`);
      
      return NextResponse.json(allLinks);
    } catch (error) {
      return handleApiError(error);
    }
  });
}

export async function POST(request: Request) {
  const clientIP = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';

  return withRateLimit(clientIP, rateLimiters.create, async () => {
    try {
      const data = await request.json();
      
      // Walidacja wymaganych pól
      validateRequired(data, ['url', 'title']);
      
      // Sprawdź czy link już istnieje
      const [existingLink] = await db.select()
        .from(links)
        .where(or(
          eq(links.url, data.url.trim()),
          eq(links.title, data.title.trim())
        ));

      if (existingLink) {
        return NextResponse.json(
          { 
            error: 'Link już istnieje w bazie',
            existingLink: {
              title: existingLink.title,
              url: existingLink.url
            }
          },
          { status: 409 }
        );
      }

      // Przygotuj dane do zapisu
      const newLink = {
        url: data.url.trim(),
        title: data.title.trim(),
        description: data.description?.trim() || null,
        prompt: null,
        imageData: null,
        imageMimeType: null,
        thumbnailData: null,
        thumbnailMimeType: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const [result] = await db.insert(links)
        .values(newLink)
        .execute();

      // Pobierz dodany link
      const [insertedLink] = await db.select()
        .from(links)
        .where(eq(links.id, result.insertId));

      if (!insertedLink) {
        throw new Error('Nie udało się pobrać dodanego linku');
      }

      // Invaliduj cache po dodaniu nowego linku
      await CacheManager.del('links:all');
      await CacheManager.delPattern('links:*');
      console.log('🗑️ Cache invalidated after adding new link');

      return NextResponse.json(insertedLink, { status: 201 });
    } catch (error) {
      return handleApiError(error);
    }
  });
}
