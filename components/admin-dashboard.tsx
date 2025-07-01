'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreateDocumentForm } from '@/components/create-document-form';
import { DocumentFilters } from '@/components/document-filters';
import { ConfirmReturnButton } from '@/components/confirm-return-button';

interface Document {
  id: string;
  title: string;
  status: string;
  consultantName: string;
  updatedAt: string;
}

export function AdminDashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      const data = await response.json();
      setDocuments(data);
      setFilteredDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleFilter = (status: string) => {
    if (status === 'ALL') {
      setFilteredDocuments(documents);
    } else {
      setFilteredDocuments(documents.filter(doc => doc.status === status));
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      DELIVERED: 'default',
      RECEIPT_CONFIRMED: 'secondary',
      RETURN_SENT: 'outline',
      COMPLETED: 'destructive'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">Manage all documents and consultants</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          Create New Document
        </Button>
      </div>

      <DocumentFilters onFilter={handleFilter} />

      <Card>
        <CardHeader>
          <CardTitle>All Documents</CardTitle>
          <CardDescription>Overview of all documents in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Consultant</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">{document.title}</TableCell>
                  <TableCell>{getStatusBadge(document.status)}</TableCell>
                  <TableCell>{document.consultantName}</TableCell>
                  <TableCell>{new Date(document.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {document.status === 'RETURN_SENT' && (
                      <ConfirmReturnButton documentId={document.id} onConfirm={fetchDocuments} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showCreateForm && (
        <CreateDocumentForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={fetchDocuments}
        />
      )}
    </div>
  );
}