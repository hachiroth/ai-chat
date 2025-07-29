import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'

dayjs.extend(isToday)
dayjs.extend(isYesterday)

export function formatRelativeDate(input: Date | string): string {
  const date = dayjs(input)
  const now = dayjs()

  if (date.isToday()) {
    return '今天'
  }

  if (date.isYesterday()) {
    return '昨天'
  }

  const twoDaysAgo = now.subtract(2, 'day').startOf('day')
  if (date.isSame(twoDaysAgo, 'day')) {
    return '前天'
  }

  return date.format('YYYY-MM-DD')
}
