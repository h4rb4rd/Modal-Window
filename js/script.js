let fruits = [
  { id: 1, title: 'Яблоки', price: 20, img: './img/apples.jpg' },
  { id: 2, title: 'Груши', price: 30, img: './img/pears.jpg' },
  { id: 3, title: 'Манго', price: 40, img: './img/mango.jpg' },
  { id: 4, title: 'Лимоны', price: 50, img: './img/lemon.jpg' },
];
const toHTML = (fruit) => `<div class="fruit-card">
<div class="fruit-card__image">
  <img src="${fruit.img}" alt="${fruit.title}"/>
</div>
<h3 class="fruit-card__title">${fruit.title}</h3>
<div class="fruit-card__buttons">
  <a href="#" class="fruit-card__btn fruit-card__btn--primary" data-btn="price" data-id="${fruit.id}">Посмотреть цену</a>
  <a href="#" class="fruit-card__btn fruit-card__btn--secondary" data-btn="delete" data-id="${fruit.id}">Удалить</a>
</div>
</div>`;

function render() {
  const html = fruits.map((fruit) => toHTML(fruit)).join('');
  document.querySelector('#fruits').innerHTML = html;
}
render();

// modal
const priceModal = $.modal({
  title: 'Цена на товар',
  closable: true,
  width: '400px',
  footerButtons: [
    {
      text: 'Закрыть',
      class: 'secondary',
      handler() {
        priceModal.close();
      },
    },
  ],
});

document.addEventListener('click', (e) => {
  e.preventDefault();
  const btnType = e.target.dataset.btn;
  const id = +e.target.dataset.id;
  const fruit = fruits.find((f) => f.id === id);

  switch (btnType) {
    case 'price':
      priceModal.setContent(`Цена на ${fruit.title}: <b>${fruit.price}</b> &#8381;`);
      return priceModal.open();
    case 'delete':
      return $.confirm({
        title: 'Вы уверены?',
        content: `Вы удалите <b>${fruit.title}</b>!`,
      })
        .then(() => {
          fruits = fruits.filter((f) => f.id !== id);
          render();
        })
        .catch(() => {
          console.log('отмена');
        });
    default:
      return;
  }
});
