"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmReceiptButton } from "@/components/confirm-receipt-button";
import { DownloadButton } from "@/components/download-button";
import { SubmitReturnButton } from "@/components/submit-return-button";
import { submitReturn } from "@/app/actions/document-actions"; // Ajuste o caminho, se necessário

interface Document {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
  attachments: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
  }>;
}

interface ConsultantDashboardProps {
  consultantId: string;
}

export function ConsultantDashboard({
  consultantId,
}: ConsultantDashboardProps) {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    fetchDocuments();
  }, [consultantId]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(
        `/api/documents?consultantId=${consultantId}`,
      );
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      DELIVERED: "default",
      RECEIPT_CONFIRMED: "secondary",
      RETURN_SENT: "outline",
      COMPLETED: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const handleSubmitReturn = async (documentId: string) => {
    // Adicione lógica para abrir um diálogo e tratar o envio do retorno aqui, se ainda não tiver
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Assigned Documents</CardTitle>
          <CardDescription>Manage your document workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead>Attachments</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">
                    {document.title}
                  </TableCell>
                  <TableCell>{getStatusBadge(document.status)}</TableCell>
                  <TableCell>
                    {new Date(document.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {document.attachments.map((attachment) => (
                        <DownloadButton
                          key={attachment.id}
                          attachment={attachment}
                          disabled={document.status === "DELIVERED"}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {document.status === "DELIVERED" && (
                        <ConfirmReceiptButton
                          documentId={document.id}
                          onConfirm={fetchDocuments}
                        />
                      )}
                      {(document.status === "RECEIPT_CONFIRMED" ||
                        document.status === "RETURN_SENT") && (
                        <SubmitReturnButton
                          documentId={document.id}
                          onSubmit={handleSubmitReturn}
                        />
                      )}
                    </div>
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
