'use server';

import { db } from '@/lib/db';
import { documents, attachments, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getDocuments(consultantId?: string) {
  try {
    const query = db
      .select({
        id: documents.id,
        title: documents.title,
        status: documents.status,
        updatedAt: documents.updatedAt,
        consultantName: users.name,
        consultantId: documents.consultantId,
      })
      .from(documents)
      .leftJoin(users, eq(documents.consultantId, users.id))
      .orderBy(desc(documents.updatedAt));

    let result;
    if (consultantId) {
      result = await query.where(eq(documents.consultantId, consultantId));
    } else {
      result = await query;
    }

    // Get attachments for each document
    const documentsWithAttachments = await Promise.all(
      result.map(async (doc) => {
        const docAttachments = await db
          .select()
          .from(attachments)
          .where(eq(attachments.documentId, doc.id));

        return {
          ...doc,
          attachments: docAttachments
        };
      })
    );

    return documentsWithAttachments;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
}

export async function confirmReceipt(documentId: string) {
  try {
    await db
      .update(documents)
      .set({ 
        status: 'RECEIPT_CONFIRMED',
        updatedAt: new Date()
      })
      .where(eq(documents.id, documentId));

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error confirming receipt:', error);
    throw error;
  }
}

export async function submitReturn(documentId: string) {
  try {
    await db
      .update(documents)
      .set({ 
        status: 'RETURN_SENT',
        updatedAt: new Date()
      })
      .where(eq(documents.id, documentId));

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error submitting return:', error);
    throw error;
  }
}

export async function confirmReturn(documentId: string) {
  try {
    await db
      .update(documents)
      .set({ 
        status: 'COMPLETED',
        updatedAt: new Date()
      })
      .where(eq(documents.id, documentId));

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error confirming return:', error);
    throw error;
  }
}

export async function createDocument(title: string, consultantId: string) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    const [newDoc] = await db
      .insert(documents)
      .values({
        title,
        consultantId,
        status: 'DELIVERED'
      })
      .returning();

    revalidatePath('/dashboard');
    return { success: true, document: newDoc };
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
}