import { useState } from 'react'
import dayjs from 'dayjs'
import { CalendarIcon, Check, Clock } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx'
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Calendar } from '@/components/ui/calendar.tsx'
import { cn } from '@/lib/utils.ts'
import { useMediaQuery } from '@/hooks/useMediaQuery.ts'

interface DateTimePickerProps {
  value: 'now' | Date
  onChange: (value: 'now' | Date) => void
}

function TimeSelector({
  dateValue,
  onTimeChange,
}: {
  dateValue: Date
  onTimeChange: (type: 'hours' | 'minutes', val: string) => void
}) {
  return (
    <div className="p-3">
      <div className="flex items-center gap-2">
        <Clock className="text-muted-foreground h-4 w-4" />
        <select
          className="bg-background min-w-15 rounded-md border px-2 py-1.5 text-sm"
          value={dateValue.getHours()}
          onChange={(e) => onTimeChange('hours', e.target.value)}
        >
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={i}>
              {String(i).padStart(2, '0')}
            </option>
          ))}
        </select>
        <span className="text-sm font-medium">:</span>
        <select
          className="bg-background min-w-15 rounded-md border px-2 py-1.5 text-sm"
          value={dateValue.getMinutes()}
          onChange={(e) => onTimeChange('minutes', e.target.value)}
        >
          {Array.from({ length: 60 }, (_, i) => (
            <option key={i} value={i}>
              {String(i).padStart(2, '0')}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 640px)')

  const isNow = value === 'now'
  const dateValue = isNow ? new Date() : value

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    const current = isNow ? new Date() : value
    date.setHours(current.getHours(), current.getMinutes())
    onChange(date)
  }

  const handleTimeChange = (type: 'hours' | 'minutes', val: string) => {
    const d = new Date(isNow ? new Date() : value)
    if (type === 'hours') d.setHours(Number.parseInt(val, 10))
    else d.setMinutes(Number.parseInt(val, 10))
    onChange(d)
  }

  const displayText = isNow ? 'Now' : dayjs(value).format('D MMM HH:mm')

  const triggerButton = (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn(
        'h-8 gap-1.5 px-2.5 text-xs font-normal',
        isNow && 'text-muted-foreground',
      )}
    >
      <CalendarIcon className="h-3 w-3" />
      {displayText}
    </Button>
  )

  const pickerContent = (
    <div>
      <Calendar
        mode="single"
        selected={dateValue}
        onSelect={handleDateSelect}
        className="mx-auto"
      />
      <TimeSelector dateValue={dateValue} onTimeChange={handleTimeChange} />
      <div className="flex items-center justify-between gap-2 border-t p-3">
        {isNow ? (
          <span />
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs font-medium"
            onClick={() => {
              onChange('now')
              setOpen(false)
            }}
          >
            Now
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          className="gap-1.5 text-xs font-medium"
          onClick={() => setOpen(false)}
        >
          <Check className="h-3.5 w-3.5" />
          Done
        </Button>
      </div>
    </div>
  )

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {pickerContent}
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent className="pb-safe">
        <div className="w-full px-4 pb-6">{pickerContent}</div>
      </DrawerContent>
    </Drawer>
  )
}
