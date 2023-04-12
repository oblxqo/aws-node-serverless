export const mapKeyValueToObject = (array, prop) => {
  return array.reduce((acc, el) => {
    const propValue = el[prop];
    if (propValue) {
      acc[propValue] = el;
    }
    return acc;
  }, {})
}