import Link from 'next/link';
import { BOARDS } from '@/lib/constants';

interface SidebarProps {
  currentSlug?: string;
}

export default function Sidebar({ currentSlug }: SidebarProps) {
  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-20">
        <div className="card-elevated p-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">게시판</h3>
          <nav className="space-y-0.5">
            {BOARDS.map((board) => (
              <Link
                key={board.slug}
                href={`/board/${board.slug}`}
                className={`flex items-center gap-2.5 px-2.5 py-2 text-sm rounded-lg transition-all ${
                  currentSlug === board.slug
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground surface-hover'
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
