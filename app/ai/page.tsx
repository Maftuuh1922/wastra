import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { UnifiedAiWorkspace } from '@/components/unified-ai-workspace'

export const metadata: Metadata = {
  title: 'AI Workspace — Wastra.ai',
  description:
    'Satu tempat untuk semua kebutuhan identifikasi dan kreasi motif batik Anda dengan teknologi AI terdepan.',
}

import { AiSidebar } from '@/components/ai-sidebar'

export default async function AiPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const initialTab = resolvedSearchParams.tab || 'wastra-studio'

  return (
    <>
      <main className="flex h-[100dvh] w-full overflow-hidden bg-background">
        <AiSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <UnifiedAiWorkspace initialTab={initialTab} />
        </div>
      </main>
    </>
  )
}
