import '../libs/dayjs.js';
import {getRandomNumber} from "./collection-utils.js";

export const now = (format) => {
  return dayjs().format(format);
};

export const getRandomDate = (format) => {
  const min = 1546268400000;
  const max = dayjs().toDate().getTime();
  const randomTime = getRandomNumber(min, max);
  return dayjs(randomTime).format(format);
}