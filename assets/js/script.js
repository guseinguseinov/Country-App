'use strict';

let themeBtn = document.querySelector('.theme-icon-btn');
let container = document.querySelector('.container');

themeBtn.addEventListener('click', function () {
    if (document.documentElement.dataset.theme == "dark") {
        document.documentElement.dataset.theme = 'light';
        localStorage.setItem('theme', 'light');
    }
    else {
        document.documentElement.dataset.theme = 'dark';
        localStorage.setItem('theme', 'dark');
    }
});


const getDataLocalStorage = function() {
    document.documentElement.dataset.theme = localStorage.getItem('theme');
} 

getDataLocalStorage();

async function getDataFromAPI() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        
        data.forEach(function(elem) {
            console.log(elem);
            addCountry(elem.flags.png, elem.name.common, elem.population, elem.region, elem.capital);
        });
    }
    catch (error) {
        console.log('Something unexpexted huppened', error);
    }
}

getDataFromAPI();

const addCountry = function(flag, countryName, population, region, capital) {
    let newLink = `
    <a class="counrty-link" href="./details.html">
        <div class="counrty-div">
            <img src="${flag}" alt="flag" />
            <div class="counrty-info">
                <p class="country-name">${countryName}</p>
                <p class="info">Population: <span class="info-span">${population}</span> </p>
                <p class="info">Region: <span class="info-span">${region}</span></p>
                <p class="info">Capital: <span class="info-span">${capital}</span></p>    
            </div>
        </div>
    </a>
    `
    container.innerHTML += newLink;

}