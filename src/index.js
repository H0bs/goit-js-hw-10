import './css/styles.css';
import fetchCountries from './fetchCountries';
import Notiflix from 'notiflix';
var debounce = require('lodash.debounce');


const DEBOUNCE_DELAY = 300;
const inputSearch = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');


Notiflix.Notify.init({
                    width: '400px',
                    fontSize: '20px',
                    cssAnimationStyle: 'zoom'
});
                
inputSearch.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
    e.preventDefault();
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    const input = e.target.value.trim();
    if (!input) {
        return
    }
    fetchCountries(input)
        .then(country => {
            if (country.length === 1) {
                renderCountryEL(country);
            } else if (country.length > 1 && country.length < 11) { 
                renderCountryList(country);
            } else  {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name');
            }  
        })
        .catch(error => {
            Notiflix.Notify.failure('Oops, there is no country with that name');
        })
}

function renderCountryEL(country) {
    const markupEl = 
 `<div class="card__descr">
        <div class="card__img">
            <img src="${country[0].flags.svg}" alt="${country[0].name}" width="400px">
        </div>
        <div class="card__box">
            <h2 class="card__title">${country[0].name}</h2>
            <p class="card__text"><span class="descr">Capital: </span>${country[0].capital}</p>
            <p class="card__text"><span class="descr">Population: </span>${country[0].population}</p>
            <ul class="card__list"><span class="descr">Languages:</span>
            </ul>
        </div>
    </div>`
    countryInfo.insertAdjacentHTML('beforeend', markupEl);
    const langList = document.querySelector('.card__list');
    const markupListLang = country[0].languages.map(({ name }) => {
        return `
        <li>${name}</li>
        `
    }).join("");
    langList.insertAdjacentHTML('beforeend', markupListLang)
}

function renderCountryList(countries) {
    const markup = countries.map(({flags, name}) => {
        return `
        <li class="card__list">
            <img src="${flags.svg}" alt="${name}" width="50px">
            ${name}
            </li>       
    `
    }).join("");
    countryList.insertAdjacentHTML('beforeend', markup);
}
