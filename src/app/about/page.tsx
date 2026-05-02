import type { Metadata } from 'next';
import { getBuildInfo } from '@/lib/build-info';
import { createClient } from '@/lib/supabase/server';
import { GitFork } from 'lucide-react';
import { GitHubIcon } from '@/components/icons/github-icon';

export const metadata: Metadata = {
  title: '关于本站',
};

export default async function AboutPage() {
  const buildInfo = getBuildInfo();

  const supabase = await createClient();
  const { data: aiModelRow } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', 'ai_model')
    .maybeSingle();
  const aiModel = aiModelRow?.value || '未配置';

  const repoLinks = [
    {
      label: 'GitHub',
      url: 'https://github.com/yoea/vibe_blog_next',
      icon: <GitHubIcon className="h-4 w-4" />,
    },
    {
      label: 'Gitee',
      url: 'https://git.ewing.top/yoea/vibe_blog_next',
      icon: <GitFork className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">关于本站</h1>

      <div className="space-y-8">
        {/* ── 简介 ── */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">字里行间</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            「字里行间」是一个基于 Next.js 与 Supabase
            构建的开源博客平台，不止是写作工具，更是读者与作者交流的空间。
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            项目以 AGPL-3.0
            协议开源，代码完全透明。你可以自由部署、修改和参与贡献。
          </p>
        </section>

        {/* ── 仓库地址 ── */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">仓库地址</h2>
          <div className="flex flex-wrap gap-3">
            {repoLinks.map((repo) => (
              <a
                key={repo.label}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {repo.icon}
                <span>{repo.label}</span>
              </a>
            ))}
          </div>
        </section>

        {/* ── 功能特性 ── */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">功能特性</h2>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-1.5 list-disc list-inside">
            <li>用户注册与登录，支持邮箱 / GitHub OAuth 两种方式</li>
            <li>Markdown 写作，实时预览，自动保存草稿到云端</li>
            <li>文章标签分类与标签管理</li>
            <li>评论与回复，支持 2 层嵌套树形展示</li>
            <li>作者主页 + 留言板，每位作者拥有独立的个人空间</li>
            <li>文章点赞（登录用户 + 匿名访客双重追踪）</li>
            <li>首页站点统计（访问量 + 点赞数，IP 去重）</li>
            <li>深色 / 浅色 / 跟随系统，三种主题模式</li>
            <li>RSS 订阅，标准格式兼容主流阅读器</li>
            <li>响应式设计，桌面端与移动端体验一致</li>
          </ul>
        </section>

        {/* ── Markdown 支持 ── */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Markdown 支持</h2>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-1.5">
            <p>
              编辑器基于{' '}
              <code className="font-mono text-xs bg-muted px-1 rounded">
                react-markdown
              </code>
              ，集成以下插件扩展语法能力：
            </p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>
                <code className="font-mono text-xs bg-muted px-1 rounded">
                  remark-gfm
                </code>{' '}
                — 表格、任务列表、删除线、自动链接
              </li>
              <li>
                <code className="font-mono text-xs bg-muted px-1 rounded">
                  remark-breaks
                </code>{' '}
                — 单换行即换行（无需末尾两个空格）
              </li>
              <li>
                <code className="font-mono text-xs bg-muted px-1 rounded">
                  rehype-highlight
                </code>{' '}
                — 代码块语法高亮（github-dark-dimmed 主题，支持 190+ 语言）
              </li>
              <li>
                <code className="font-mono text-xs bg-muted px-1 rounded">
                  rehype-sanitize
                </code>{' '}
                — 输出内容安全过滤，防止 XSS 攻击
              </li>
            </ul>
          </div>
        </section>

        {/* ── 缓存与性能 ── */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">缓存与性能</h2>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-1.5">
            <p>
              为缓解 Supabase Free Tier 冷启动延迟，公开页面启用
              ISR（增量静态再生成）：
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-3 py-1.5 text-left font-medium">页面</th>
                    <th className="px-3 py-1.5 text-left font-medium">缓存</th>
                    <th className="px-3 py-1.5 text-left font-medium">说明</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-3 py-1.5 font-mono">首页 /</td>
                    <td className="px-3 py-1.5">5 分钟</td>
                    <td className="px-3 py-1.5">revalidate = 300</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-1.5 font-mono">
                      文章详情 /posts/[slug]
                    </td>
                    <td className="px-3 py-1.5">5 分钟</td>
                    <td className="px-3 py-1.5">revalidate = 300</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-1.5">管理页 / 编辑页 / 设置页</td>
                    <td className="px-3 py-1.5">无缓存</td>
                    <td className="px-3 py-1.5">实时数据</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              发布或修改文章后，
              <code className="font-mono text-xs bg-muted px-1 rounded">
                revalidatePath
              </code>{' '}
              自动清除相关缓存，确保读者看到最新内容。点赞与评论通过 Server
              Actions + 乐观 UI 处理，不受服务端缓存影响。
            </p>
          </div>
        </section>

        {/* ── 技术栈 ── */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">技术栈</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {[
              { label: '框架', value: 'Next.js 16 (App Router) + React 19' },
              { label: '语言', value: 'TypeScript' },
              { label: '样式', value: 'Tailwind CSS v4 + shadcn/ui' },
              { label: '数据库', value: 'Supabase (PostgreSQL + RLS)' },
              { label: '认证', value: 'Supabase Auth (PKCE 流程)' },
              { label: 'Markdown', value: 'react-markdown + 4 个插件' },
              { label: '图标', value: 'Lucide React' },
              { label: '部署', value: 'PM2 + Nginx 反向代理' },
              { label: '许可证', value: 'AGPL-3.0' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between px-3 py-2 rounded-md border bg-card"
              >
                <span className="text-muted-foreground text-xs">
                  {item.label}
                </span>
                <span className="text-xs font-medium text-right ml-2">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 内容生成 ── */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">AI 内容生成</h2>
          <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p>
              文章编辑器内置 AI 辅助功能，可一键生成摘要和推荐标签。兼容 OpenAI
              API，支持任意兼容的模型服务。
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <span className="font-medium text-foreground">摘要生成</span> —
                基于标题与正文提炼核心观点，输出 140
                字以内的精炼摘要，作为文章预览展示。
              </li>
              <li>
                <span className="font-medium text-foreground">标签推荐</span> —
                分析文章主题输出 4 个主标签 + 6
                个备选标签，匹配站点常用标签的自动填入，其余放入备选区手动选择。
              </li>
            </ul>
            <p>
              当前驱动模型：
              <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded ml-1">
                {aiModel}
              </code>
            </p>
          </div>
        </section>

        {/* ── 构建信息 ── */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">构建信息</h2>
          <div className="rounded-lg border divide-y">
            <InfoRow
              label="版本"
              value={`v${buildInfo.version}`}
              href={`https://github.com/yoea/vibe_blog_next/releases/tag/v${buildInfo.version}`}
            />
            {buildInfo.buildTime && (
              <InfoRow
                label="构建时间"
                value={new Date(buildInfo.buildTime).toLocaleString('zh-CN')}
              />
            )}
            {buildInfo.commit && (
              <InfoRow label="提交" value={buildInfo.commit} mono />
            )}
            {buildInfo.commitCount !== null && (
              <InfoRow label="提交次数" value={`${buildInfo.commitCount}次`} />
            )}
            {buildInfo.contributors && (
              <InfoRow label="开发者" value={buildInfo.contributors} />
            )}
            <InfoRow label="运行时" value={`Node ${buildInfo.nodeVersion}`} />
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono,
  href,
}: {
  label: string;
  value: string;
  mono?: boolean;
  href?: string;
}) {
  const content = (
    <span
      className={`text-right max-w-[60%] truncate ${mono ? 'font-mono text-xs' : ''}`}
      title={value}
    >
      {value}
    </span>
  );
  return (
    <div className="flex items-center justify-between px-4 py-2.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span className={`text-right ${mono ? 'font-mono text-xs' : ''}`}>
            {value}
          </span>
        </a>
      ) : (
        content
      )}
    </div>
  );
}
