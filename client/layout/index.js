document.addEventListener('click', function onClickMenuItem(event) {
  if (event.target.classList.contains('menu-child')) return;
  const target = getParentElementByClass(event.target, 'menu-item');
  if (!target) return;
  if (target.classList.contains('open')) {
    target.classList.remove('open');
  } else {
    target.classList.add('open');
  }
});