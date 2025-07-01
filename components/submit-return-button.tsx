
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { submitReturn } from '@/app/actions/document-actions';

interface SubmitReturnButtonProps {
  documentId: string;
}

export default function SubmitReturnButton({ documentId }: SubmitReturnButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      formData.append('documentId', documentId);
      await submitReturn(formData);
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting return:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default">
          Submit Return
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Return Document</DialogTitle>
          <DialogDescription>
            Upload your return document for this assignment.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="returnFile" className="text-sm font-medium">
              Return Document File
            </label>
            <Input
              id="returnFile"
              name="returnFile"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Uploading...' : 'Submit Return'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
