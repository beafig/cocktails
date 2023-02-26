'use strict';

// global variables

const cocktailList = document.querySelector('.js-cocktails');
const favouritesList = document.querySelector('.js-favourites');
const inputElement = document.querySelector('.js-input');
const searchBtn = document.querySelector('.js-searchBtn');
const resetBtn = document.querySelector('.js-resetBtn');
const urlMargaritas = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita';
let allCocktails = [];
let favCocktails = [];

//charge list of Margaritas when loading the page

fetch(urlMargaritas)
  .then(response => response.json())
  .then(data => {
    map(data);
    renderCocktails(allCocktails);
    addEvent();
  });

// function to create new array with some data elements using map

function map(array) {
  allCocktails = array.drinks.map((drink) => ({
    name: drink.strDrink,
    photo: drink.strDrinkThumb,
    id: drink.idDrink
  }));
}

// search favourites in LocalStorage

const localFav = JSON.parse(localStorage.getItem('cocktails'));
function searchFav() {
  if (localFav) {
    favCocktails = localFav;
    renderFavourites(favCocktails);
  }
}
searchFav();

//function to paint list of cocktails

function renderCocktails(array) {
  cocktailList.innerHTML = '';
  for (const eachObj of array) {
    const indexCocktail = favCocktails.findIndex(drink => drink.id === eachObj.id);
    let photoCocktail = eachObj.photo;
    let selected = '';
    if (indexCocktail !== -1) {
      selected = 'selected';
    }
    if (favCocktails === []) {
      selected = '';// al darle a reset no se quitaba la clase, sería correcto expresarlo así?
    }
    if (!photoCocktail) {
      photoCocktail = './assets/images/cocktails.png';
    }
    const html = `<li class="js-liElement main__list--cocktails ${selected}" id="${eachObj.id}"><h3 class="main__list--name main__list--name2">${eachObj.name}</h3> <img src="${photoCocktail}" title="${eachObj.name}" alt="${eachObj.name}" class="main__list--img main__list--img2"/></li>`;
    cocktailList.innerHTML += html;
  }
  addEvent();
}

// handle function for search button

function handleClickBtn(ev) {
  ev.preventDefault();
  const inputValue = inputElement.value;
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${inputValue}`)
    .then(response => response.json())
    .then(data => {
      if (data.drinks === null) {
        cocktailList.innerHTML = 'Lo sentimos, el cóctel buscado no está en la lista';
      } else {
        map(data);
        cocktailList.innerHTML = '';
        renderCocktails(allCocktails);
      }
    });
}

// handle function to add to favourites list

function handleClickList(ev) {
  const selectedCocktails = allCocktails.find(drink => drink.id === ev.currentTarget.id);
  const indexCocktail = favCocktails.findIndex(drink => drink.id === ev.currentTarget.id);
  if (indexCocktail === -1) {
    ev.currentTarget.classList.add('selected');
    favCocktails.push(selectedCocktails);
    renderFavourites(favCocktails);
    localStorage.setItem('cocktails', JSON.stringify(favCocktails));
  } else {
    ev.currentTarget.classList.remove('selected');
    favCocktails.splice(indexCocktail, 1);
    renderFavourites(favCocktails);
    localStorage.removeItem('cocktails');
    localStorage.setItem('cocktails', JSON.stringify(favCocktails));
  }
  addCloseBtn();
}

// function to paint list of favourites

function renderFavourites(array) {
  favouritesList.innerHTML = '';
  for (const eachObj of array) {
    favouritesList.innerHTML += `<li class="js-liElement main__list--cocktails" id="${eachObj.id}"><h3 class="main__list--name">${eachObj.name}<i class="fa-solid fa-xmark js-closeIcon" id="${eachObj.id}"></i></h3> <img class="main__list--img img" src="${eachObj.photo}" title="${eachObj.name}" alt="${eachObj.name}" class="main__list--img"/> </li>`;
  }
  addCloseBtn();
}

// handle function to reset favourites list

function handleClickReset(ev) {
  ev.preventDefault();
  favCocktails = []; //porque no se me vaciaba la lista de favoritos
  favouritesList.innerHTML = '';
  localStorage.removeItem('cocktails');
  renderCocktails(allCocktails); // para que se vuelva a pintar el listado y se quite la clase selected pero no funciona sin el nuevo if 
  console.log(favCocktails);
}

// handle function to delete each favourite

function handleClickClose(ev) {
  const indexClose = favCocktails.findIndex(close => close.id === ev.currentTarget.id);
  favCocktails.splice(indexClose, 1);
  localStorage.removeItem('cocktails');
  renderFavourites(favCocktails);
  renderCocktails(allCocktails);
  localStorage.setItem('cocktails', JSON.stringify(favCocktails));
  console.log(favCocktails); // me devuelve un elemento más del que debería haber, el primer click funciona, al segundo si quito un elemento se vuelve a añadir al final de la lista
}
console.log(favCocktails);

// function to searh by pressing enter

function handleIntro(ev) {
  if (ev.code === 'Enter') {
    handleClickBtn(ev);
  }
}

//EVENTS

//listener in search button
searchBtn.addEventListener('click', handleClickBtn);

//listener in cocktail's list
function addEvent() {
  const liElements = document.querySelectorAll('.js-liElement');
  for (const eachLi of liElements) {
    eachLi.addEventListener('click', handleClickList);
  }
}

//listener in reset button
resetBtn.addEventListener('click', handleClickReset);

//listener in x icons to delete favs
function addCloseBtn() {
  const closeIcons = document.querySelectorAll('.js-closeIcon');
  for (const eachX of closeIcons) {
    eachX.addEventListener('click', handleClickClose);
  }
}

// listener para realizar busqueda al pulsar intro

inputElement.addEventListener('keyup', handleIntro)