'use client';

import { Button } from '@/components/ui/button';

interface DocumentFiltersProps {
  onFilter: (status: string) => void;
}

export function DocumentFilters({ onFilter }: DocumentFiltersProps) {
  const statuses = [
    { label: 'All', value: 'ALL' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Receipt Confirmed', value: 'RECEIPT_CONFIRMED' },
    { label: 'Return Sent', value: 'RETURN_SENT' },
    { label: 'Completed', value: 'COMPLETED' }
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {statuses.map((status) => (
        <Button
          key={status.value}
          variant="outline"
          size="sm"
          onClick={() => onFilter(status.value)}
        >
          {status.label}
        </Button>
      ))}
    </div>
  );
}