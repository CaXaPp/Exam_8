let searchByNameUri = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s='
let searchByImageUri = 'https://www.thecocktaildb.com/images/ingredients/%imageName%-Small.png'

const drinksSection = document.getElementById('cocktail-card-section');
const cocktailModal = document.getElementById('cocktailModal');
const cocktailModalBody = cocktailModal.getElementsByClassName('modal-body')[0];
const cocktailModalTitle = cocktailModal.getElementsByClassName('modal-title')[0];
const searchByNameForm = document.getElementById('search-cocktail-by-name');

window.addEventListener('load', function () {
    searchByNameForm.addEventListener('submit', searchByName);
})

function searchByName(e) {
    e.preventDefault()
    drinksSection.innerHTML = '';
    let target = e.target;
    let formData = new FormData(target);
    let data = Object.fromEntries(formData);
    const url = searchByNameUri + data.search
    fetch(url)
        .then(async (response) => {
            if (response.ok) {
                let result = await response.json();
                appendDrinksToDOM(result.drinks);
                return false;
            } else {
                throw new Error(response.status + " Failed Fetch ");
            }
        }).catch(e => alert('Cannot find cocktail, try again'))
}

function appendDrinksToDOM(drinks) {
    drinks.forEach(drink => {
        let col = document.createElement('div');
        col.setAttribute('class', 'col-4 my-2')
        col.innerHTML = drawCocktailCards(drink);

        let btnView = col.getElementsByClassName('btn-card-view')[0];
        btnView.addEventListener('click', function () {
            cocktailModalBody.innerHTML = ''
            cocktailModalBody.append(modalInfo(drink))
            cocktailModalTitle.textContent = drink.strDrink;
        })


        drinksSection.append(col);
    })
}

function drawCocktailCards(drink) {
    return `<div class="card" style="width: 18rem;">
        <img src="${drink.strDrinkThumb}" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${drink.strDrink}</h5>
                <a class="btn btn-primary btn-card-view"  data-bs-toggle="modal" data-bs-target="#cocktailModal" >View</a>
            </div>
    </div>`
}

function modalInfo(drink) {
    const ingredientP = (ingr, ingrMeasure) => {
        return `<img src="${searchByImageUri.replace('%imageName%', ingr)}"> ${ingr}  ${ingrMeasure}`
    }
    let div = document.createElement('div');
    div.innerHTML = `
    <p>Ingridients:</p>
    <hr>
    <div class="ingredients-area"></div>
    <hr>
    <p>Instructions:</p>
    <p> ${drink.strInstructions}</p>`

    let area = div.getElementsByClassName('ingredients-area')[0];
    for (let i = 1; i <=15; i++) {
        let ingredientKey = 'strIngredient' + i;
        let measureKey = 'strMeasure' + i;
        if(drink[ingredientKey]){
            let p = document.createElement('p');
            p.innerHTML = ingredientP(drink[ingredientKey], drink[measureKey])
            area.append(p)
        }
    }
    return div;
}
