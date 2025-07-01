
import { pgTable, text, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRole = pgEnum('user_role', ['ADMIN', 'CONSULTANT']);
export const documentStatus = pgEnum('document_status', ['DELIVERED', 'RECEIPT_CONFIRMED', 'RETURN_SENT', 'COMPLETED']);
export const attachmentType = pgEnum('attachment_type', ['INITIAL', 'RETURN']);

// User table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  hashedPassword: text('hashed_password').notNull(),
  role: userRole('role').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Document table
export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  status: documentStatus('status').notNull().default('DELIVERED'),
  consultantId: uuid('consultant_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Attachment table
export const attachments = pgTable('attachments', {
  id: uuid('id').defaultRandom().primaryKey(),
  documentId: uuid('document_id').notNull().references(() => documents.id),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(),
  attachmentType: attachmentType('attachment_type').notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});

// Relations
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

// Types
export type User = typeof users.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type Attachment = typeof attachments.$inferSelect;
export type DocumentWithRelations = Document & {
  consultant: User;
  attachments: Attachment[];
};
