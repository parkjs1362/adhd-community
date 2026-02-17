import Link from 'next/link';
import { BOARDS } from '@/lib/constants';

interface SidebarProps {
  currentSlug?: string;
}

export default function Sidebar({ currentSlug }: SidebarProps) {
  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-16">
        <div className="card-elevated p-2">
          <nav className="space-y-0.5">
            {BOARDS.map((board) => (
              <Link
                key={board.slug}
                href={`/board/${board.slug}`}
                className={`flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-xl transition-colors ${
                  currentSlug === board.slug
                    ? 'bg-primary/8 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: board.color }}
                />
                {board.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
