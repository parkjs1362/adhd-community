import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { BOARDS } from '@/lib/constants';

export default function BoardList() {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <h3 className="text-sm font-semibold text-slate-700 px-4 py-3 border-b border-slate-100">
        게시판
      </h3>
      {BOARDS.map((board) => (
        <Link
          key={board.slug}
          href={`/board/${board.slug}`}
          className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: board.color }} />
            <span className="text-sm font-medium text-slate-700">{board.name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span>{board.description}</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </Link>
      ))}
    </div>
  );
}
