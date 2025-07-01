
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DocumentFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get('status') || 'all';

  const filters = [
    { key: 'all', label: 'All Documents' },
    { key: 'DELIVERED', label: 'Pending Receipt' },
    { key: 'RECEIPT_CONFIRMED', label: 'Pending Return' },
    { key: 'RETURN_SENT', label: 'Returns to Check' },
    { key: 'COMPLETED', label: 'Completed' },
  ];

  const handleFilterChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status === 'all') {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.key}
          variant={currentFilter === filter.key ? 'default' : 'outline'}
          onClick={() => handleFilterChange(filter.key)}
          size="sm"
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
