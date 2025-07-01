
'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Attachment } from '@/lib/db/schema';

interface DownloadButtonProps {
  attachment: Attachment;
  disabled?: boolean;
}

export default function DownloadButton({ attachment, disabled = false }: DownloadButtonProps) {
  const handleDownload = () => {
    if (!disabled) {
      window.open(attachment.fileUrl, '_blank');
    }
  };

  return (
    <Button
      onClick={handleDownload}
      size="sm"
      variant="outline"
      disabled={disabled}
      className={disabled ? 'opacity-50 cursor-not-allowed' : ''}
    >
      <Download className="h-4 w-4 mr-1" />
      Download
    </Button>
  );
}
