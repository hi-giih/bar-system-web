import { format, parseISO } from 'date-fns'

export function formatarData(dataIso: string): string {
  return format(parseISO(dataIso), 'dd/MM/yyyy')
}
