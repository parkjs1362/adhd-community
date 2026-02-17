import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { BOARDS } from '@/lib/constants';

export default function BoardList() {
  return (
    <div className="card-elevated overflow-hidden">
      <h3 className="text-sm font-semibold text-foreground px-5 py-3.5 border-b border-border/30">
        게시판
      </h3>
      {BOARDS.map((board) => (
        <Link
          key={board.slug}
          href={`/board/${board.slug}`}
          className="flex items-center justify-between px-5 py-3.5 surface-hover border-b border-border/30 last:border-b-0 group"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: board.color }} />
            <span className="text-sm font-medium text-foreground/85 group-hover:text-foreground transition-colors duration-200">{board.name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{board.description}</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </Link>
      ))}
    </div>
  );
}
