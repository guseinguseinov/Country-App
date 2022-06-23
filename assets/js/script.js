'use strict';

let themeBtn = document.querySelector('.theme-icon-btn');
let container = document.querySelector('.container');
let select = document.querySelector('select');
const currentUrl = new URL(location.href);
const params = currentUrl.searchParams;

// dark mode handler
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

const changeSelectOption = function(value) {
    container.innerHTML = '';
    if (value === 'All' || value === null) {
        getDataFromAPI();        
    }
    else {
        getDataFromAPI(`https://restcountries.com/v3.1/region/` + value.toLowerCase());
    }
}

// adding counrties to html
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

// getting data from local storage
const getDataLocalStorage = function() {
    document.documentElement.dataset.theme = localStorage.getItem('theme');
    changeSelectOption(localStorage.getItem('userSelect'));
    if (params.get('region') !== null) {
        let region = params.get('region');
        changeSelectOption(region);
        select.value = region;
        localStorage.setItem('userSelect', region)
    }
    
} 

async function getDataFromAPI(url = 'https://restcountries.com/v3.1/all') {
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // for (let elem of data) {
        //     addCountry(elem.flags.png, elem.name.common, elem.population, elem.region, elem.capital);
        // }
        data.forEach(function(elem) {
            addCountry(elem.flags.png, elem.name.common, elem.population, elem.region, elem.capital);
        });
    }
    catch (error) {
        console.log('Something unexpexted huppened', error);
    }
}

select.addEventListener('change', function(event) {
    changeSelectOption(event.target.value);
    localStorage.setItem('userSelect', event.target.value);
    if (event.target.value === "All") {
        history.pushState(null, null, `/`);
    }
    else {
        history.pushState(null, null, `?region=${event.target.value}`);
    }
});

getDataLocalStorage();

