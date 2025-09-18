export async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${res.status}`);
  return res.json() as Promise<T>;
}
