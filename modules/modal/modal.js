Element.prototype.appendAfter = function (element) {
  element.parentNode.insertBefore(this, element.nextSibling);
};

function noop() {}
function _createModalFooter(buttons = []) {
  if (buttons.length === 0) {
    return document.createElement('div');
  }
  const wrapper = document.createElement('div');
  wrapper.classList.add('modal-footer');

  buttons.forEach((btn) => {
    const $btn = document.createElement('button');
    $btn.textContent = btn.text;
    $btn.classList.add('modal-btn');
    $btn.classList.add(`modal-btn--${btn.class}` || 'primary');
    $btn.onclick = btn.handler || noop;

    wrapper.appendChild($btn);
  });
  return wrapper;
}

function _createModal(options) {
  const DEFAULT_WIDTH = '600px';
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.insertAdjacentHTML(
    'afterbegin',
    `<div class="modal-overlay" data-close="true">
  <div class="modal-window" style="width:${options.width || DEFAULT_WIDTH}">
    <div class="modal-header">
      <span class="modal-title">${options.title || 'Title'}</span>
   ${options.closable ? `<span class="modal-close" data-close="true">&times;</span>` : ''}
    </div>
    <div class="modal-body" data-content>
      ${options.content || 'Content'}
    </div>
  </div>
</div>`
  );
  const footer = _createModalFooter(options.footerButtons);
  footer.appendAfter(modal.querySelector('[data-content]'));
  document.body.appendChild(modal);
  return modal;
}

$.modal = function (options) {
  const ANIMATION_SPEED = 200;
  const $modal = _createModal(options);
  let isClosing = false;
  let isDestroyed = false;

  const modal = {
    open() {
      if (isDestroyed) {
        return console.log('Modal is destroyed');
      }
      !isClosing && $modal.classList.add('open');
    },
    close() {
      isClosing = true;
      $modal.classList.remove('open');
      $modal.classList.add('hide');
      setTimeout(() => {
        $modal.classList.remove('hide');
        isClosing = false;
        if (typeof options.onClose === 'function') {
          options.onClose();
        }
      }, ANIMATION_SPEED);
    },
  };

  const listener = (e) => {
    if (e.target.dataset.close) {
      modal.close();
    }
  };
  $modal.addEventListener('click', listener);
  return {
    ...modal,
    destroy() {
      $modal.parentNode.removeChild($modal);
      $modal.removeEventListener('click', listener);
      isDestroyed = true;
    },
    setContent(html) {
      $modal.querySelector('[data-content]').innerHTML = html;
    },
  };
};
