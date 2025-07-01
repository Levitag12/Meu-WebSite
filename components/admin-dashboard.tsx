
import { db } from '@/lib/db';
import { documents, users, attachments } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CreateDocumentForm from '@/components/create-document-form';
import { confirmReturnReceived } from '@/app/actions/document-actions';
import ConfirmReturnButton from '@/components/confirm-return-button';
import DocumentFilters from '@/components/document-filters';

async function getDocumentsWithRelations() {
  return await db
    .select({
      id: documents.id,
      title: documents.title,
      status: documents.status,
      createdAt: documents.createdAt,
      updatedAt: documents.updatedAt,
      consultant: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(documents)
    .leftJoin(users, eq(documents.consultantId, users.id))
    .orderBy(desc(documents.createdAt));
}

async function getConsultants() {
  return await db
    .select()
    .from(users)
    .where(eq(users.role, 'CONSULTANT'));
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

export default async function AdminDashboard() {
  const documentsData = await getDocumentsWithRelations();
  const consultants = await getConsultants();

  // Calculate statistics
  const stats = {
    total: documentsData.length,
    pendingReceipt: documentsData.filter(d => d.status === 'DELIVERED').length,
    pendingReturn: documentsData.filter(d => d.status === 'RECEIPT_CONFIRMED').length,
    returnsToCheck: documentsData.filter(d => d.status === 'RETURN_SENT').length,
    completed: documentsData.filter(d => d.status === 'COMPLETED').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <CreateDocumentForm consultants={consultants} />
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
            <CardTitle className="text-sm font-medium">Pending Receipt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReceipt}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Return</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReturn}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Returns to Check</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.returnsToCheck}</div>
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

      {/* Document Filters */}
      <DocumentFilters />

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>
            Manage all documents and track their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Consultant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentsData.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">{document.title}</TableCell>
                  <TableCell>{document.consultant?.name}</TableCell>
                  <TableCell>{getStatusBadge(document.status)}</TableCell>
                  <TableCell>
                    {new Date(document.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(document.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {document.status === 'RETURN_SENT' && (
                      <ConfirmReturnButton documentId={document.id} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
