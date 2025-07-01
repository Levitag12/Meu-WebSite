import { pgTable, text, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core';
export const roleEnum = pgEnum('role', ['ADMIN', 'CONSULTANT']);
export const statusEnum = pgEnum('status', ['DELIVERED', 'RECEIPT_CONFIRMED', 'RETURN_SENT', 'COMPLETED']);
export const fileTypeEnum = pgEnum('file_type', ['ORIGINAL', 'RETURN']);
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  password: text('hashed_password').notNull(),
  role: roleEnum('role').notNull().default('CONSULTANT'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  status: statusEnum('status').notNull().default('DELIVERED'),
  consultantId: uuid('consultant_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export const attachments = pgTable('attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  documentId: uuid('document_id').references(() => documents.id).notNull(),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(),
  fileType: fileTypeEnum('file_type').notNull().default('ORIGINAL'),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});
import { relations } from 'drizzle-orm';

export const usersRelations = relations(users, ({ many }) => ({
  documents: many(documents),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  consultant: one(users, {
    fields: [documents.consultantId],
    references: [users.id],
  }),
  attachments: many(attachments),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  document: one(documents, {
    fields: [attachments.documentId],
    references: [documents.id],
  }),
}));

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Document = typeof documents.$inferSelect
export type NewDocument = typeof documents.$inferInsert
export type Attachment = typeof attachments.$inferSelect
export type NewAttachment = typeof attachments.$inferInsert