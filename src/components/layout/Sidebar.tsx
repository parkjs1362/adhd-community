import Link from 'next/link';
import { BOARDS } from '@/lib/constants';

interface SidebarProps {
  currentSlug?: string;
}

export default function Sidebar({ currentSlug }: SidebarProps) {
  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-20">
        <h3 className="text-sm font-semibold text-slate-500 mb-2 px-3">게시판</h3>
        <nav className="space-y-0.5">
          {BOARDS.map((board) => (
            <Link
              key={board.slug}
              href={`/board/${board.slug}`}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                currentSlug === board.slug
                  ? 'bg-[#4A90D9]/10 text-[#4A90D9] font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
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
    </aside>
  );
}
