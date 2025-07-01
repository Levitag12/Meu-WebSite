
'use client';

import { Button } from '@/components/ui/button';
import { confirmReceipt } from '@/app/actions/document-actions';

interface ConfirmReceiptButtonProps {
  documentId: string;
}

export default function ConfirmReceiptButton({ documentId }: ConfirmReceiptButtonProps) {
  const handleConfirmReceipt = async () => {
    await confirmReceipt(documentId);
  };

  return (
    <Button
      onClick={handleConfirmReceipt}
      size="sm"
      variant="outline"
    >
      Confirm Receipt
    </Button>
  );
}
