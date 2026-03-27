import type { NSNamen } from '@/types/station.ts'

/** Use the festive name when available, otherwise fall back to the regular name. */
export function displayName(
  namen: NSNamen,
  variant: 'lang' | 'kort' | 'middel' = 'lang',
): string {
  return namen.festive ?? namen[variant]
}
