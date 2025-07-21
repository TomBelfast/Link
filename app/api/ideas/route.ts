import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { ideas } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import CacheManager from '@/lib/redis';

// GET /api/ideas - pobierz wszystkie pomysły
export async function GET() {
  try {
    const cacheKey = 'ideas:all';
    
    // Sprawdź cache
    const cachedIdeas = await CacheManager.get(cacheKey);
    if (cachedIdeas) {
      console.log('📦 Returning ideas from cache');
      return NextResponse.json(cachedIdeas);
    }
    
    console.log('🔍 Fetching ideas from database');
    
    // Sprawdź połączenie z bazą danych
    await db.execute(sql`SELECT 1`);
    console.log('✅ Połączenie z bazą danych działa poprawnie');

    const allIdeas = await db.select().from(ideas).orderBy(ideas.createdAt);
    console.log(`Pobrane pomysły: ${allIdeas.length} items`);
    
    // Zapisz do cache na 5 minut
    await CacheManager.set(cacheKey, allIdeas, 300);
    console.log(`💾 Cached ${allIdeas.length} ideas`);
    
    return NextResponse.json(allIdeas);
  } catch (error) {
    console.error('Błąd podczas pobierania pomysłów:', error);
    return NextResponse.json(
      { error: 'Nie udało się pobrać pomysłów' },
      { status: 500 }
    );
  }
}

// POST /api/ideas - dodaj nowy pomysł
export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Otrzymane dane:', data);
    
    // Generuj nowe UUID dla pomysłu
    const newId = uuidv4();
    
    // Dodaj pomysł do bazy
    const insertResult = await db.insert(ideas).values({
      id: newId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('Wynik insertu:', insertResult);
    
    // Pobierz dodany pomysł
    const newIdea = await db
      .select()
      .from(ideas)
      .where(eq(ideas.id, newId))
      .then(res => res[0]);
    
    console.log('Pobrany pomysł:', newIdea);
    
    if (!newIdea) {
      throw new Error('Nie udało się pobrać utworzonego pomysłu');
    }
    
    // Invaliduj cache po dodaniu nowego pomysłu
    await CacheManager.del('ideas:all');
    await CacheManager.delPattern('ideas:*');
    console.log('🗑️ Cache invalidated after adding new idea');
    
    return NextResponse.json(newIdea);
  } catch (error) {
    console.error('Błąd podczas dodawania pomysłu:', error);
    return NextResponse.json(
      { error: 'Nie udało się dodać pomysłu' },
      { status: 500 }
    );
  }
} 