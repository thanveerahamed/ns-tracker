import type { NSStation } from '@/types/station.ts'

const STORAGE_PREFIX = 'splitViewPanel:'

export interface PersistedPanelState {
  origin?: NSStation
  destination?: NSStation
  dateTime: 'now' | string
  isArrival: boolean
}

export function loadPanelState(panelId: string): PersistedPanelState | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${panelId}`)
    return raw ? (JSON.parse(raw) as PersistedPanelState) : null
  } catch {
    return null
  }
}

export function savePanelState(panelId: string, state: PersistedPanelState) {
  localStorage.setItem(`${STORAGE_PREFIX}${panelId}`, JSON.stringify(state))
}

export function removePanelState(panelId: string) {
  localStorage.removeItem(`${STORAGE_PREFIX}${panelId}`)
}
