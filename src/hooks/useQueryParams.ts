'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Route } from 'next';

export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = (key: string) => searchParams.get(key) ?? '';

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value == null || value === '') next.delete(key);
    else next.set(key, value);

    // typed-routes friendly (query-only strings are not accepted)
    router.replace(`${pathname}?${next.toString()}` as Route);
  };

  return { get, set };
}
