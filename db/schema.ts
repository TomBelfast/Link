import { mysqlTable, varchar, text, timestamp, int, binary } from 'drizzle-orm/mysql-core';

export const links = mysqlTable('links', {
  id: int('id').primaryKey().autoincrement(),
  url: varchar('url', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  prompt: text('prompt'),
  imageData: binary('image_data', { length: 4294967295 }),
  imageMimeType: varchar('image_mime_type', { length: 50 }),
  thumbnailData: binary('thumbnail_data', { length: 4294967295 }),
  thumbnailMimeType: varchar('thumbnail_mime_type', { length: 50 }),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
});

export const ideas = mysqlTable('ideas', {
  id: varchar('id', { length: 36 }).primaryKey(), // UUID
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 20 }).notNull(), // 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
});

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
export type Idea = typeof ideas.$inferSelect;
export type NewIdea = typeof ideas.$inferInsert;
