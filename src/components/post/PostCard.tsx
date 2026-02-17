import Link from 'next/link';
import { MessageCircle, Heart, Eye } from 'lucide-react';
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
      className="flex items-center gap-3 px-4 py-3.5 surface-hover border-b border-border/50 last:border-b-0 group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          {isHot && (
            <span className="badge-hot text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
              HOT
            </span>
          )}
          {isNew && !isHot && (
            <span className="badge-new text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
              NEW
            </span>
          )}
          <h3 className="text-sm font-medium text-card-foreground truncate group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          {post.comment_count > 0 && (
            <span className="text-xs text-primary font-medium shrink-0">
              [{post.comment_count}]
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {showBoard && post.board && (
            <span className="text-secondary-foreground font-medium">{post.board.name}</span>
          )}
          <span>{post.author_nickname}</span>
          <span className="text-muted-foreground/60">{timeAgo}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          {post.view_count}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="h-3 w-3" />
          {post.like_count}
        </span>
      </div>
    </Link>
  );
}
