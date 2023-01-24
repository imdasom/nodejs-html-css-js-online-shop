export const parseQueryString = (queryString) => {
  return queryString.split('&').reduce((accm, queryString) => {
    const key = queryString.split('=')[0];
    const value = queryString.split('=')[1];
    if (!!value) {
      accm[key] = value;
    }
    return accm;
  }, {});
}
