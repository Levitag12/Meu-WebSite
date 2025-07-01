
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { documents, attachments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Schema validation
const createDocumentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  consultantId: z.string().uuid('Invalid consultant ID'),
});

const fileSchema = z.object({
  name: z.string(),
  size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
  type: z.string(),
});

export async function createDocument(formData: FormData) {
  const session = await auth();
  
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  try {
    // Validate form data
    const title = formData.get('title') as string;
    const consultantId = formData.get('consultantId') as string;
    const file = formData.get('file') as File;

    const validatedData = createDocumentSchema.parse({
      title,
      consultantId,
    });

    if (!file || file.size === 0) {
      throw new Error('File is required');
    }

    // Upload file to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
    });

    // Create document record
    const [newDocument] = await db
      .insert(documents)
      .values({
        title: validatedData.title,
        consultantId: validatedData.consultantId,
        status: 'DELIVERED',
      })
      .returning();

    // Create initial attachment record
    await db.insert(attachments).values({
      documentId: newDocument.id,
      fileName: file.name,
      fileUrl: blob.url,
      attachmentType: 'INITIAL',
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error creating document:', error);
    throw new Error('Failed to create document');
  }
}

export async function confirmReceipt(documentId: string) {
  const session = await auth();
  
  if (!session || session.user.role !== 'CONSULTANT') {
    throw new Error('Unauthorized');
  }

  try {
    // Verify the document belongs to the consultant and is in DELIVERED status
    const [document] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, documentId))
      .limit(1);

    if (!document) {
      throw new Error('Document not found');
    }

    if (document.consultantId !== session.user.id) {
      throw new Error('Document not assigned to you');
    }

    if (document.status !== 'DELIVERED') {
      throw new Error('Document is not in delivered status');
    }

    // Update document status to RECEIPT_CONFIRMED
    await db
      .update(documents)
      .set({
        status: 'RECEIPT_CONFIRMED',
        updatedAt: new Date(),
      })
      .where(eq(documents.id, documentId));

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error confirming receipt:', error);
    throw new Error('Failed to confirm receipt');
  }
}

export async function submitReturn(formData: FormData) {
  const session = await auth();
  
  if (!session || session.user.role !== 'CONSULTANT') {
    throw new Error('Unauthorized');
  }

  try {
    const documentId = formData.get('documentId') as string;
    const returnFile = formData.get('returnFile') as File;

    if (!returnFile || returnFile.size === 0) {
      throw new Error('Return file is required');
    }

    // Verify the document belongs to the consultant and is in RECEIPT_CONFIRMED status
    const [document] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, documentId))
      .limit(1);

    if (!document) {
      throw new Error('Document not found');
    }

    if (document.consultantId !== session.user.id) {
      throw new Error('Document not assigned to you');
    }

    if (document.status !== 'RECEIPT_CONFIRMED') {
      throw new Error('Document is not ready for return submission');
    }

    // Upload return file to Vercel Blob
    const blob = await put(returnFile.name, returnFile, {
      access: 'public',
    });

    // Create return attachment record
    await db.insert(attachments).values({
      documentId: documentId,
      fileName: returnFile.name,
      fileUrl: blob.url,
      attachmentType: 'RETURN',
    });

    // Update document status to RETURN_SENT
    await db
      .update(documents)
      .set({
        status: 'RETURN_SENT',
        updatedAt: new Date(),
      })
      .where(eq(documents.id, documentId));

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error submitting return:', error);
    throw new Error('Failed to submit return');
  }
}

export async function confirmReturnReceived(documentId: string) {
  const session = await auth();
  
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  try {
    // Verify the document is in RETURN_SENT status
    const [document] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, documentId))
      .limit(1);

    if (!document) {
      throw new Error('Document not found');
    }

    if (document.status !== 'RETURN_SENT') {
      throw new Error('Document is not in return sent status');
    }

    // Update document status to COMPLETED
    await db
      .update(documents)
      .set({
        status: 'COMPLETED',
        updatedAt: new Date(),
      })
      .where(eq(documents.id, documentId));

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error confirming return received:', error);
    throw new Error('Failed to confirm return received');
  }
}
