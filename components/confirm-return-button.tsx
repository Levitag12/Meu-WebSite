
'use client';

import { Button } from '@/components/ui/button';
import { confirmReturnReceived } from '@/app/actions/document-actions';

interface ConfirmReturnButtonProps {
  documentId: string;
}

export default function ConfirmReturnButton({ documentId }: ConfirmReturnButtonProps) {
  const handleConfirmReturn = async () => {
    await confirmReturnReceived(documentId);
  };

  return (
    <Button
      onClick={handleConfirmReturn}
      size="sm"
      variant="default"
    >
      Confirm Return Received
    </Button>
  );
}
