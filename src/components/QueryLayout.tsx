'use client';

import { useSearchParams } from 'next/navigation';
import { shouldShowLayout } from '@/lib/layoutSearchParam';

/** Query-dependent chrome stays on the client so the document can be exported. */
export default function QueryLayout({ children }: { children: React.ReactNode }) {
  const params = useSearchParams();
  return shouldShowLayout({ layout: params.get('layout') ?? undefined }) ? children : null;
}
