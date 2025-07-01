
import { pgTable, text, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'CONSULTANT'])
export const documentStatusEnum = pgEnum('document_status', [
  'DELIVERED',
  'RECEIPT_CONFIRMED', 
  'RETURN_SENT',
  'COMPLETED'
])
export const attachmentTypeEnum = pgEnum('attachment_type', ['INITIAL', 'RETURN'])

// Tables
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  hashedPassword: text('hashed_password').notNull(),
  role: userRoleEnum('role').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  status: documentStatusEnum('status').notNull().default('DELIVERED'),
  consultantId: uuid('consultant_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const attachments = pgTable('attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  documentId: uuid('document_id').notNull().references(() => documents.id),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(),
  attachmentType: attachmentTypeEnum('attachment_type').notNull(),
  uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  documents: many(documents),
}))

export const documentsRelations = relations(documents, ({ one, many }) => ({
  consultant: one(users, {
    fields: [documents.consultantId],
    references: [users.id],
  }),
  attachments: many(attachments),
}))

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  document: one(documents, {
    fields: [attachments.documentId],
    references: [documents.id],
  }),
}))

// Types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Document = typeof documents.$inferSelect
export type NewDocument = typeof documents.$inferInsert
export type Attachment = typeof attachments.$inferSelect
export type NewAttachment = typeof attachments.$inferInsert
