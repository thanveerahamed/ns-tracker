import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'

dayjs.extend(duration)
dayjs.extend(relativeTime)

export const extendedDayjs = dayjs
