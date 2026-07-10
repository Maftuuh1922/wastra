import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { UnifiedAiWorkspace } from '@/components/unified-ai-workspace'

export const metadata: Metadata = {
  title: 'AI Testing Ground — Wastra.ai',
  description:
    'Pusat pengujian dan perbandingan model AI Wastra untuk klasifikasi dan deteksi motif batik.',
}

export default async function AiPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const initialTab = resolvedSearchParams.tab || 'scan-cepat'

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full relative w-full">
        <Navbar />
        
        <main className="flex-1 overflow-hidden pt-20 relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
          <UnifiedAiWorkspace initialTab={initialTab} />
        </main>
      </div>
    </div>
  )
}
