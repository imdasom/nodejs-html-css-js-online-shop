function getParentElementByClass(element, className) {
  if (element === null) {
    return null;
  }
  if (element.classList.contains(className)) {
    return element;
  }
  return getParentElementByClass(element.parentElement, className);
}
