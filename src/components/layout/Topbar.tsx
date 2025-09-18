import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-black/20 border-b border-white/10">
      <div className="h-14 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logos/teams-hq.svg" alt="Teams HQ" width={24} height={24} />
          <span className="font-semibold">Teams HQ</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
