import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Columns2, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button.tsx'
import { SplitViewPanel } from '@/components/splitView/SplitViewPanel.tsx'
import { removePanelState } from '@/services/splitViewPanel.ts'
import { useMediaQuery } from '@/hooks/useMediaQuery.ts'
import { cn } from '@/lib/utils.ts'

/* ─── localStorage helpers ─── */
const PANELS_KEY = 'splitViewPanels'

interface PersistedPanelList {
  panels: number[]
  nextId: number
}

function loadPanels(): PersistedPanelList {
  try {
    const raw = localStorage.getItem(PANELS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedPanelList
      if (parsed.panels?.length >= 2) return parsed
    }
  } catch {
    /* ignore */
  }
  return { panels: [1, 2], nextId: 3 }
}

function savePanels(state: PersistedPanelList) {
  localStorage.setItem(PANELS_KEY, JSON.stringify(state))
}

function makeLabel(index: number) {
  // A, B, C, … Z, AA, AB …
  let label = ''
  let n = index
  do {
    label = String.fromCharCode(65 + (n % 26)) + label
    n = Math.floor(n / 26) - 1
  } while (n >= 0)
  return `Route ${label}`
}

export function SplitViewPage() {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const initial = loadPanels()
  const [panels, setPanels] = useState<number[]>(initial.panels)
  const [nextIdState, setNextIdState] = useState(initial.nextId)
  const [activeTab, setActiveTab] = useState(initial.panels[0])

  const persist = useCallback((newPanels: number[], newNextId: number) => {
    savePanels({ panels: newPanels, nextId: newNextId })
  }, [])

  const addPanel = useCallback(() => {
    const id = nextIdState
    const newNextId = nextIdState + 1
    setPanels((prev) => {
      const next = [...prev, id]
      persist(next, newNextId)
      return next
    })
    setNextIdState(newNextId)
    if (!isDesktop) setActiveTab(id)
  }, [isDesktop, nextIdState, persist])

  const removePanel = useCallback(
    (id: number) => {
      setPanels((prev) => {
        if (prev.length <= 2) return prev
        const next = prev.filter((p) => p !== id)
        if (activeTab === id) setActiveTab(next[next.length - 1])
        removePanelState(String(id)) // clean up panel's stored state
        persist(next, nextIdState)
        return next
      })
    },
    [activeTab, nextIdState, persist],
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex w-full max-w-6xl flex-col px-4 pt-4 pb-20 sm:pt-8"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Columns2 className="text-primary h-5 w-5" />
          <h1 className="text-lg font-semibold">Compare routes</h1>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={addPanel}
        >
          <Plus className="h-3.5 w-3.5" />
          Add route
        </Button>
      </div>

      {isDesktop ? (
        /* Desktop: responsive grid */
        <div
          className={cn(
            'grid gap-4',
            panels.length === 2 && 'grid-cols-2',
            panels.length === 3 && 'grid-cols-3',
            panels.length >= 4 && 'grid-cols-2 lg:grid-cols-4',
          )}
        >
          {panels.map((id, idx) => (
            <div key={id} className="bg-card rounded-xl border p-4">
              <SplitViewPanel
                panelId={String(id)}
                title={makeLabel(idx)}
                onRemove={panels.length > 2 ? () => removePanel(id) : undefined}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Mobile: scrollable tabs */
        <>
          <div className="bg-muted mb-3 flex overflow-x-auto rounded-lg border p-1">
            {panels.map((id, idx) => (
              <Button
                key={id}
                type="button"
                variant={activeTab === id ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  'flex-shrink-0 text-xs',
                  panels.length <= 3 && 'flex-1',
                  activeTab !== id && 'text-muted-foreground',
                )}
                onClick={() => setActiveTab(id)}
              >
                {makeLabel(idx)}
              </Button>
            ))}
          </div>

          {/* Keep all mounted to preserve state; hide inactive */}
          {panels.map((id, idx) => (
            <div key={id} className={cn(activeTab !== id && 'hidden')}>
              <SplitViewPanel
                panelId={String(id)}
                title={makeLabel(idx)}
                onRemove={panels.length > 2 ? () => removePanel(id) : undefined}
              />
            </div>
          ))}
        </>
      )}
    </motion.div>
  )
}
