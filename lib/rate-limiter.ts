import CacheManager from './redis';

interface RateLimitConfig {
  windowMs: number; // Okno czasowe w milisekundach
  maxRequests: number; // Maksymalna liczba requestów w oknie
  keyGenerator?: (identifier: string) => string;
}

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      keyGenerator: (id: string) => `rate_limit:${id}`,
      ...config
    };
  }

  async checkLimit(identifier: string): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
    total: number;
  }> {
    try {
      const key = this.config.keyGenerator!(identifier);
      const windowStart = Math.floor(Date.now() / this.config.windowMs) * this.config.windowMs;
      const windowKey = `${key}:${windowStart}`;

      // Pobierz aktualną liczbę requestów
      const currentCount = await CacheManager.get<number>(windowKey) || 0;
      const newCount = currentCount + 1;

      // Sprawdź czy przekroczono limit
      const allowed = newCount <= this.config.maxRequests;
      
      if (allowed) {
        // Zapisz nową liczbę requestów
        const ttlSeconds = Math.ceil(this.config.windowMs / 1000);
        await CacheManager.set(windowKey, newCount, ttlSeconds);
      }

      return {
        allowed,
        remaining: Math.max(0, this.config.maxRequests - newCount),
        resetTime: windowStart + this.config.windowMs,
        total: this.config.maxRequests
      };
    } catch (error) {
      console.error('Rate limiter error:', error);
      // W przypadku błędu, pozwól na request (fail-open)
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: Date.now() + this.config.windowMs,
        total: this.config.maxRequests
      };
    }
  }
}

// Predefiniowane rate limitery
export const rateLimiters = {
  // API ogólne - 100 requestów na minutę
  api: new RateLimiter({
    windowMs: 60 * 1000, // 1 minuta
    maxRequests: 100
  }),

  // API tworzenia - 10 requestów na minutę
  create: new RateLimiter({
    windowMs: 60 * 1000, // 1 minuta
    maxRequests: 10
  }),

  // API logowania - 5 prób na 15 minut
  auth: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minut
    maxRequests: 5
  })
};

// Helper function do użycia w API routes
export async function withRateLimit(
  identifier: string,
  limiter: RateLimiter,
  handler: () => Promise<Response>
): Promise<Response> {
  const result = await limiter.checkLimit(identifier);

  if (!result.allowed) {
    return new Response(
      JSON.stringify({
        error: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': result.total.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.resetTime.toString(),
          'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString()
        }
      }
    );
  }

  const response = await handler();

  // Dodaj headers z informacjami o rate limiting
  response.headers.set('X-RateLimit-Limit', result.total.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', result.resetTime.toString());

  return response;
}