import dayjs from 'dayjs';
import 'dayjs/locale/nl';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(duration);
dayjs.extend(isBetween);

export { dayjs as extendedDayjs };
