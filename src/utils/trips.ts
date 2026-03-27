import type { NesProperties } from '@/types/trip.ts'

export function getPaletteColorFromNesProperties(
  nesProperties?: NesProperties,
): string {
  if (!nesProperties) return 'text-foreground'

  switch (nesProperties.color) {
    case 'warning':
      return 'text-amber-500'
    case 'alert':
    case 'error':
      return 'text-destructive'
    case 'success':
      return 'text-emerald-500'
    case 'info':
      return 'text-blue-500'
    default:
      return 'text-foreground'
  }
}
