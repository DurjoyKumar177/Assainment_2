
document.addEventListener('DOMContentLoaded', function () {
    searchMeals('a');// initially scearch by a.
});

document.getElementById('searchButton').addEventListener('click', () => {
    const searchInput = document.getElementById('searchInput').value.trim();
    searchMeals(searchInput);
});

function searchMeals(searchTerm = '') {
    if (searchTerm === '') return;

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
        .then(response => response.json())
        .then(data => {
            displayMeals(data.meals);
        });
}

function displayMeals(meals) {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';

    if (!meals) {
        searchResults.innerHTML = '<p class="text-center">No meals found.</p>';
        return;
    }

    meals.sort((a, b) => a.strMeal.localeCompare(b.strMeal));

    meals.forEach(meal => {
        const col = document.createElement('div');
        col.classList.add('col');

        const card = document.createElement('div');
        card.classList.add('card', 'meal-card');
        card.innerHTML = `
            <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
            <div class="card-body">
                <h5 class="card-title">${meal.strMeal}</h5>
            </div>
        `;
        card.addEventListener('click', () => showMealDetails(meal.idMeal));

        col.appendChild(card);
        searchResults.appendChild(col);
    });
}

function showMealDetails(idMeal) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            document.getElementById('mealName').textContent = meal.strMeal;
            document.getElementById('mealImage').src = meal.strMealThumb;
            document.getElementById('mealInstructions').textContent = meal.strInstructions;

            const ingredientsList = document.getElementById('mealIngredients');
            ingredientsList.innerHTML = '';

            for (let i = 1; i <= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];

                if (ingredient && ingredient !== '') {
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item');
                    listItem.textContent = `${ingredient} - ${measure}`;
                    ingredientsList.appendChild(listItem);
                }
            }

            const mealDetails = document.getElementById('mealDetails');
            mealDetails.classList.remove('d-none');
            mealDetails.scrollIntoView({ behavior: 'smooth' });
        });
}
