import {
  format,
  isPast,
  formatDistanceToNowStrict,
  differenceInMinutes,
} from 'date-fns';
export default function dateFormat(date, pattern = 'HH:ii a, MMM dd, yyyy') {
  try {
    if (typeof date === 'string') {
      const dateArr = date.split(/\-| |T|:/g).map((_) => parseInt(_));
      if (dateArr && dateArr.length === 6) {
        dateArr[1] = dateArr[1] - 1;
        return format(new Date(...dateArr), pattern);
      }
    } else if (typeof date === 'object') {
      return format(new Date(...date), pattern);
    }
    return 'Invalid Date';
  } catch (e) {
    return 'Invalid Date';
  }
}
export function timesRemaining(date) {
  try {
    const _date = date.split(/\-| |:/).map((n, i) => (i === 1 ? +n - 1 : +n));
    const toDate = new Date(..._date);
    const past = isPast(toDate);
    return {
      past,
      time: formatDistanceToNowStrict(toDate, { addSuffix: true }),
    };
  } catch (e) {
    return 'Invalid Date!';
  }
}

export function timeDistance(date) {
  try {
    const _date = date.split(/\-| |:/).map((n, i) => (i === 1 ? +n - 1 : +n));
    return differenceInMinutes(Date.now(), new Date(..._date));
  } catch (e) {
    return 0;
  }
}
