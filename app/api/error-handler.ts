import { NextResponse } from 'next/server';

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof Error) {
    // Database connection errors
    if (error.message.includes('ECONNREFUSED') || error.message.includes('PROTOCOL_CONNECTION_LOST')) {
      return NextResponse.json(
        { error: 'Database connection failed', code: 'DB_CONNECTION_ERROR' },
        { status: 503 }
      );
    }

    // Validation errors
    if (error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid data provided', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: error.message, code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }

  // Unknown error
  return NextResponse.json(
    { error: 'An unexpected error occurred', code: 'UNKNOWN_ERROR' },
    { status: 500 }
  );
}

export function validateRequired(data: Record<string, any>, fields: string[]): void {
  const missing = fields.filter(field => !data[field] || data[field].trim() === '');
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}