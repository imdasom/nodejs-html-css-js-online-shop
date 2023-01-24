export const sample = (list) => {
  const min = 0;
  const max = list.length;
  const index = Math.floor(Math.random() * (max - min) + min);
  return list[index];
};
export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}