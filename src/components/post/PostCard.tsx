import Link from 'next/link';
import { MessageCircle, Heart, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HOT_THRESHOLD, NEW_THRESHOLD_HOURS } from '@/lib/constants';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);
dayjs.locale('ko');

interface PostCardProps {
  post: {
    id: string;
    title: string;
    author_nickname: string;
    view_count: number;
    like_count: number;
    comment_count: number;
    created_at: string;
    board?: { name: string; slug: string } | null;
  };
  showBoard?: boolean;
}

export default function PostCard({ post, showBoard = false }: PostCardProps) {
  const isNew = dayjs().diff(dayjs(post.created_at), 'hour') < NEW_THRESHOLD_HOURS;
  const isHot = post.like_count >= HOT_THRESHOLD;
  const timeAgo = dayjs(post.created_at).fromNow();

  return (
    <Link
      href={`/post/${post.id}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          {isHot && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0 bg-red-100 text-red-600 border-0">
              HOT
            </Badge>
          )}
          {isNew && !isHot && (
            <Badge className="text-[10px] px-1.5 py-0 bg-blue-100 text-blue-600 border-0">
              NEW
            </Badge>
          )}
          <h3 className="text-sm font-medium text-slate-800 truncate">
            {post.title}
          </h3>
          {post.comment_count > 0 && (
            <span className="text-xs text-[#4A90D9] font-medium shrink-0">
              [{post.comment_count}]
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {showBoard && post.board && (
            <span className="text-slate-500">{post.board.name}</span>
          )}
          <span>{post.author_nickname}</span>
          <span>{timeAgo}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
        <span className="flex items-center gap-0.5">
          <Eye className="h-3 w-3" />
          {post.view_count}
        </span>
        <span className="flex items-center gap-0.5">
          <Heart className="h-3 w-3" />
          {post.like_count}
        </span>
      </div>
    </Link>
  );
}
