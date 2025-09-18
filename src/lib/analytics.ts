export function track(event: string, payload?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('[analytics]', event, payload);
  }
}
