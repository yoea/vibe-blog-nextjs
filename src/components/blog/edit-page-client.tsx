'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostEditor } from '@/components/blog/post-editor';
import { ClearContentButton } from '@/components/blog/clear-content-button';
import type { PostWithAuthor } from '@/lib/db/types';

interface Props {
  post: PostWithAuthor;
  suggestedTags: {
    name: string;
    slug: string;
    color: string | null;
    post_count: number;
  }[];
}

export function EditPageClient({ post, suggestedTags }: Props) {
  const [editorKey, setEditorKey] = useState(0);

  return (
    <>
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="ghost" size="sm">
          <Link
            href={`/posts/${post.slug}`}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            返回文章详情
          </Link>
        </Button>
        <div className="ml-auto">
          <ClearContentButton
            postId={post.id}
            onClear={() => setEditorKey((k) => k + 1)}
          />
        </div>
      </div>
      <h1 className="text-3xl font-bold">编辑文章</h1>
      <PostEditor
        key={editorKey}
        initialData={post as any}
        suggestedTags={suggestedTags}
      />
    </>
  );
}
