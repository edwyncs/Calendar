import { format, parse, startOfWeek, getDay, addHours } from 'date-fns';
import { dateFnsLocalizer } from 'react-big-calendar';
import esES from 'date-fns/locale/es'

const locales = {
    // 'en-US': enUS,
    'es': esES,
}

export const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})