# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Application Commands
- `npm run dev` - Start development server on port 9999 (0.0.0.0)
- `npm run build` - Build production version (uses 4GB memory allocation)
- `npm start` - Start production server on port 9999 (0.0.0.0)
- `npm run lint` - Run ESLint
- `npm test` - Run Vitest tests

### Database Commands
- `npm run db:generate` - Generate Drizzle migrations from schema
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio for database management
- `npm run db:seed` - Seed database with initial data
- `npm run db:sync` - Sync schema with database
- `npm run db:setup` - Complete database setup (sync + generate + push)

### Testing
- Tests use Vitest framework with `__tests__/setup.ts` configuration
- Test files are in `__tests__/` directory
- Run single test: `npm test -- specific-test-file.test.ts`

### Application Testing
Every application change MUST be tested with curl commands. If the application fails to work, search the internet for solutions, apply fixes, and rerun until it works properly.

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript with strict mode
- **Database**: MySQL/MariaDB 10 with Drizzle ORM
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Caching**: Redis
- **Testing**: Vitest
- **Deployment**: Docker

### Core Structure
- **App Router**: All routes in `app/` directory using Next.js 13+ App Router
- **API Routes**: RESTful endpoints in `app/api/` with proper error handling
- **Database**: Schema-first approach with Drizzle ORM, migrations in `drizzle/`
- **Components**: Shared UI components in `components/` with TypeScript interfaces
- **Utilities**: Database utilities in `lib/db/`, general utilities in `lib/`

### Database Architecture
- **ORM**: Drizzle with MySQL driver
- **Connection**: Connection pooling with retry logic and migration auto-execution
- **Schema**: Modular schema files in `lib/db/schema/` exported from `index.ts`
- **Types**: MariaDB 10 compatible types (varchar, text, timestamp, int, binary)
- **Migrations**: Automatic execution on database connection
- **Charset**: UTF8MB4 with unicode collation

### Key Features
- **Link Management**: URL collection with metadata, thumbnails, and image storage
- **Ideas Tracking**: Project idea management with status workflow
- **Media Handling**: Image upload/storage with thumbnail generation
- **Authentication**: User management with custom crypto-based password hashing
- **Caching**: Redis integration for performance optimization
- **Error Handling**: Comprehensive error boundaries and API error responses

### Component Patterns
- **Dynamic Imports**: Performance optimization with loading states
- **Absolute Imports**: Using `@/` alias for clean import paths
- **TypeScript**: Strict typing with interfaces for all data structures
- **Error Boundaries**: Client-side error handling with user-friendly messages
- **Toast Notifications**: react-hot-toast for user feedback

### Docker Configuration
- **Multi-stage builds**: Optimized production images
- **Services**: Redis cache and Next.js application
- **Health checks**: HTTP endpoints for container monitoring
- **Volumes**: Persistent storage for uploads and cache
- **Networks**: External bridge network for reverse proxy integration

### Development Considerations
- **Port**: Application runs on port 9999 (both dev and production)
- **Memory**: 4GB allocation for builds due to image processing
- **Encoding**: UTF-8 configuration for Windows compatibility
- **File Structure**: Follows Next.js App Router conventions with TypeScript

### Code Style Guidelines
- Follow TypeScript strict mode requirements
- Use functional components with arrow functions
- Prefer interfaces over types for objects
- Use descriptive variable names with helper verbs (isLoading, hasError)
- Apply Tailwind CSS classes grouped by category
- Implement proper error handling with try/catch blocks
- Use absolute imports (@/...) for better maintainability