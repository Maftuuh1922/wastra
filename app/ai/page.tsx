import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { UnifiedAiWorkspace } from '@/components/unified-ai-workspace'

export const metadata: Metadata = {
  title: 'AI Workspace — Wastra.ai',
  description:
    'Satu tempat untuk semua kebutuhan identifikasi dan kreasi motif batik Anda dengan teknologi AI terdepan.',
}

export default async function AiPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const initialTab = resolvedSearchParams.tab || 'wastra-studio'

  return (
    <>
      <Navbar />
      <main className="flex h-[100dvh] w-full flex-col overflow-hidden bg-background">
        <UnifiedAiWorkspace initialTab={initialTab} />
      </main>
    </>
  )
}
