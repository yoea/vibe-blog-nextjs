'use client'

import { useState } from 'react'
import Image from 'next/image'
import { getUserColor } from '@/lib/utils/colors'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'

interface AvatarProps {
  avatarUrl?: string | null
  displayName?: string | null
  userId: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  previewable?: boolean
}

const sizeMap = {
  xs: { px: 24, fontSize: 'text-xs' },
  sm: { px: 32, fontSize: 'text-sm' },
  md: { px: 40, fontSize: 'text-base' },
  lg: { px: 48, fontSize: 'text-lg' },
  xl: { px: 64, fontSize: 'text-xl' },
}

export function Avatar({ avatarUrl, displayName, userId, size = 'md', className, previewable }: AvatarProps) {
  const [imgError, setImgError] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const { px, fontSize } = sizeMap[size]
  const initial = (displayName ?? userId).charAt(0).toUpperCase()
  const bgColor = getUserColor(userId)

  const showPreview = previewable && avatarUrl && !imgError

  const avatarContent = avatarUrl && !imgError ? (
    <div
      className={cn(
        'relative rounded-full overflow-hidden shrink-0',
        showPreview && 'cursor-pointer',
        className
      )}
      style={{ width: px, height: px }}
      onClick={showPreview ? () => setPreviewOpen(true) : undefined}
      role={showPreview ? 'button' : undefined}
      tabIndex={showPreview ? 0 : undefined}
      onKeyDown={showPreview ? (e) => { if (e.key === 'Enter' || e.key === ' ') setPreviewOpen(true) } : undefined}
    >
      <Image
        src={avatarUrl}
        alt={displayName ?? 'avatar'}
        width={px * 2}
        height={px * 2}
        className="object-cover w-full h-full"
        onError={() => setImgError(true)}
      />
    </div>
  ) : (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-bold text-white shrink-0 select-none',
        fontSize,
        className
      )}
      style={{ width: px, height: px, backgroundColor: bgColor }}
    >
      {initial}
    </div>
  )

  return (
    <>
      {avatarContent}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-lg p-2">
          <div className="flex items-center justify-center">
            <Image
              src={avatarUrl!}
              alt={displayName ?? 'avatar'}
              width={512}
              height={512}
              className="object-contain rounded-lg max-h-[80vh] w-auto h-auto"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
