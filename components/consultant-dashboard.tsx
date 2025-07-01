
import { db } from '@/lib/db';
import { documents, attachments } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ConfirmReceiptButton from '@/components/confirm-receipt-button';
import DownloadButton from '@/components/download-button';
import SubmitReturnButton from '@/components/submit-return-button';

interface ConsultantDashboardProps {
  userId: string;
}

async function getConsultantDocuments(consultantId: string) {
  const documentsData = await db
    .select()
    .from(documents)
    .where(eq(documents.consultantId, consultantId))
    .orderBy(desc(documents.createdAt));

  // Get attachments for each document
  const documentsWithAttachments = await Promise.all(
    documentsData.map(async (doc) => {
      const docAttachments = await db
        .select()
        .from(attachments)
        .where(eq(attachments.documentId, doc.id));

      return {
        ...doc,
        attachments: docAttachments,
      };
    })
  );

  return documentsWithAttachments;
}

function getStatusBadge(status: string) {
  const variants = {
    DELIVERED: 'default',
    RECEIPT_CONFIRMED: 'secondary',
    RETURN_SENT: 'destructive',
    COMPLETED: 'outline',
  } as const;

  const labels = {
    DELIVERED: 'Delivered',
    RECEIPT_CONFIRMED: 'Receipt Confirmed',
    RETURN_SENT: 'Return Sent',
    COMPLETED: 'Completed',
  };

  return (
    <Badge variant={variants[status as keyof typeof variants]}>
      {labels[status as keyof typeof labels]}
    </Badge>
  );
}

export default async function ConsultantDashboard({ userId }: ConsultantDashboardProps) {
  const documentsData = await getConsultantDocuments(userId);

  // Calculate statistics
  const stats = {
    total: documentsData.length,
    awaitingReceipt: documentsData.filter(d => d.status === 'DELIVERED').length,
    awaitingReturn: documentsData.filter(d => d.status === 'RECEIPT_CONFIRMED').length,
    returnsSent: documentsData.filter(d => d.status === 'RETURN_SENT').length,
    completed: documentsData.filter(d => d.status === 'COMPLETED').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">My Documents</h2>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awaiting Receipt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.awaitingReceipt}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awaiting Return</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.awaitingReturn}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Returns Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.returnsSent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Assigned Documents</CardTitle>
          <CardDescription>
            Manage your document workflow: confirm receipt, download files, and submit returns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentsData.map((document) => {
                const initialAttachment = document.attachments.find(
                  att => att.attachmentType === 'INITIAL'
                );
                return (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">{document.title}</TableCell>
                    <TableCell>{getStatusBadge(document.status)}</TableCell>
                    <TableCell>
                      {new Date(document.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {/* Confirm Receipt Button - only for DELIVERED status */}
                        {document.status === 'DELIVERED' && (
                          <ConfirmReceiptButton documentId={document.id} />
                        )}
                        
                        {/* Download Button - enabled only after receipt confirmation */}
                        {initialAttachment && (
                          <DownloadButton
                            attachment={initialAttachment}
                            disabled={document.status === 'DELIVERED'}
                          />
                        )}
                        
                        {/* Submit Return Button - only for RECEIPT_CONFIRMED status */}
                        {document.status === 'RECEIPT_CONFIRMED' && (
                          <SubmitReturnButton documentId={document.id} />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
