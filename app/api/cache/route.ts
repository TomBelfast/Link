import { NextResponse } from 'next/server';
import CacheManager from '@/lib/redis';
import { handleApiError } from '../error-handler';

// GET /api/cache - sprawdź status cache
export async function GET() {
  try {
    const stats = {
      status: 'connected',
      timestamp: new Date().toISOString(),
      keys: {
        links: await CacheManager.exists('links:all'),
        ideas: await CacheManager.exists('ideas:all'),
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/cache - wyczyść cache
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pattern = searchParams.get('pattern');

    if (pattern) {
      // Usuń klucze pasujące do wzorca
      const deletedCount = await CacheManager.delPattern(pattern);
      return NextResponse.json({ 
        message: `Deleted ${deletedCount} cache entries matching pattern: ${pattern}`,
        deletedCount 
      });
    } else {
      // Wyczyść cały cache
      await CacheManager.flush();
      return NextResponse.json({ 
        message: 'All cache cleared successfully' 
      });
    }
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/cache/warm - rozgrzej cache
export async function POST() {
  try {
    console.log('🔥 Warming up cache...');
    
    // Rozgrzej cache dla linków
    const linksResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999'}/api/links`);
    const links = await linksResponse.json();
    
    // Rozgrzej cache dla pomysłów
    const ideasResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999'}/api/ideas`);
    const ideas = await ideasResponse.json();
    
    return NextResponse.json({
      message: 'Cache warmed up successfully',
      cached: {
        links: Array.isArray(links) ? links.length : 0,
        ideas: Array.isArray(ideas) ? ideas.length : 0,
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}