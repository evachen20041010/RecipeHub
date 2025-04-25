const navToggle = document.querySelector('.nav-toggle');
const body = document.body;
navToggle.addEventListener('click', () => {
  body.classList.toggle('nav-open');
});

const recipeGrid = document.getElementById('recipe-grid');
const recipes = [
  { title: '香煎檸檬雞', author: 'Chef A', likes: 120 },
  { title: '蜂蜜烤鮭魚', author: 'Chef B', likes: 98 },
  { title: '泰式打拋豬', author: 'Chef C', likes: 142 },
];
recipes.forEach(recipe => {
  const card = document.createElement('article');
  card.className = 'recipe-card';
  card.innerHTML = `
    <img src="https://via.placeholder.com/300x200" alt="${recipe.title}" />
    <div class="card-content">
      <h3>${recipe.title}</h3>
      <p class="author">By ${recipe.author}</p>
      <div class="card-actions">
        <button class="btn-like">❤ ${recipe.likes}</button>
      </div>
    </div>
  `;
  recipeGrid.appendChild(card);
});
