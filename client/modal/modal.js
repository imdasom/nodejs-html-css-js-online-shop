const Modal = {
  init: function() {
    this.$modalContainer = document.querySelector('.modal-container');
    this.$modalContainer.innerHTML = '' +
      '<div class="modal">' +
      '  <div class="modal-header">' +
      '    <div class="modal-title"></div>' +
      '    <div class="close-button">X</div>' +
      '  </div>' +
      '  <div class="modal-content"></div>' +
      '</div>';
    this.$modalTitle = document.querySelector('.modal-title');
    this.$modalContent = document.querySelector('.modal-content');
    this.$closeButton = document.querySelector('.close-button');
    this.$closeButton.addEventListener('click', () => {
      Modal.close();
    })
  },
  open: function ({ title, content }) {
    this.$modalTitle.innerHTML = title;
    this.$modalContent.innerHTML = content;
    this.$modalContainer.style.display = '';
  },
  close: function() {
    this.$modalContainer.style.display = 'none';
  }
};
