'use strict';

let container = document.querySelector('.container');
let select = document.querySelector('select');
let userForm = document.querySelector('.user-form');
let userInput = document.querySelector('input[type="text"]');
let backBtn = document.querySelector('.back-btn');


const getCurrentUrlParams = function() {
    let currentUrl = new URL(location.href);
    return currentUrl.searchParams;
}

const changeSelectOption = function(value) {
    container.innerHTML = '';
    if (value === 'All' || value === null || value === undefined) {
        getDataFromAPI();        
    }
    else {
        getDataFromAPI(`https://restcountries.com/v3.1/region/` + value.toLowerCase());
    }
}

// adding counrties to html
const addCountry = function(flag, countryName, population, region, capital) {
    let newLink = `
    <a class="counrty-link" href="./details.html?country=${countryName}">
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
const getDefaultData = function() {
    let params = getCurrentUrlParams();
    userInput.value = '';
    if (params.get('region') !== null) {
        let region = params.get('region');
        select.value = region;
        localStorage.setItem('userSelect', region);
        changeSelectOption(region);
        history.pushState(null, null, `?region=${region}`);
    }
    else if (params.get('region') === null) {
        localStorage.setItem('userSelect', 'All');
        changeSelectOption();
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
        console.log('error happened stupid', error);
    }
}

select.addEventListener('change', function(event) {
    userInput.value = '';
    changeSelectOption(event.target.value);
    localStorage.setItem('userSelect', event.target.value);
    if (event.target.value === "All") {
        history.pushState(null, null, `/?region=All`);
    }
    else {
        history.pushState(null, null, `?region=${event.target.value}`);
    }
});

userForm.addEventListener('submit', function(event) {
    event.preventDefault();
});

userInput.addEventListener('input', function(event) {
    container.innerHTML = "";
    let params = getCurrentUrlParams();
    if (event.target.value.length !== 0){
        history.pushState(null, null, `?search=${event.target.value}`)
        getDataFromAPI(`https://restcountries.com/v3.1/name/` + event.target.value);  
    }
    else {
        params.delete('search');
        getDefaultData();
    }
});

getDefaultData();

