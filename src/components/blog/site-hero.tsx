import { FileText } from 'lucide-react';
import { SiteStats } from './site-stats';
import {
  getSiteViewsCount,
  getSiteLikesCount,
  getTotalPostsCount,
} from '@/lib/db/queries';
import { createClient } from '@/lib/supabase/server';

export async function SiteHero() {
  const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE ?? 'Blog';
  const fallbackDesc =
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? '简洁美观的多人博客平台';
  const { count: viewsCount } = await getSiteViewsCount();
  const { count: likesCount } = await getSiteLikesCount();
  const { count: totalPosts } = await getTotalPostsCount();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 读取管理员的 MOTD 作为网站副标题
  const { data: adminSettings } = await supabase
    .from('user_settings')
    .select('motd')
    .eq('is_admin', true)
    .maybeSingle();
  const siteDescription = adminSettings?.motd || fallbackDesc;

  return (
    <section className="text-center py-6 space-y-2 mb-4">
      <h1 className="text-2xl font-bold">{siteTitle}</h1>
      <p className="text-muted-foreground text-sm">{siteDescription}</p>

      <div className="flex items-center justify-center gap-4 text-muted-foreground select-none">
        <SiteStats initialViews={viewsCount} initialLikes={likesCount} />
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium">
          <FileText className="h-3.5 w-3.5" />
          <span>{totalPosts}</span>
        </div>
      </div>

      {!user && (
        <p className="text-[11px] text-muted-foreground/60 max-w-md mx-auto leading-relaxed">
          当前未登录，但您可以浏览文章，以及点赞、评论、给作者留言和打赏。
        </p>
      )}
    </section>
  );
}
