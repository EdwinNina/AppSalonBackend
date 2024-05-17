import { format } from "date-fns"
import { es } from 'date-fns/locale'

export const convertToHumanFormat = (date: Date) => {
   return format(date, 'PPPP', { locale: es })
}