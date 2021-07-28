const date = document.getElementById('date'),
    time = document.getElementById('time'),
    greeting = document.getElementById('greeting'),
    name = document.getElementById('name'),
    focus = document.getElementById('focus'),
    changeImageButton = document.getElementById('imgButton');

const locationName = document.getElementById('location');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weatherIcon');
const windSpeed = document.getElementById('windSpeed');
const humidity = document.getElementById('humidity');

const blockquote = document.querySelector('blockquote');
const figcaption = document.querySelector('figcaption');
const blockButton = document.getElementById('blockButton');

const allImages = [];
let currentImage;

const namesOfDays = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
}

const namesOfMonth = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec"
}

function getImage() {
    const dayTime = ['night', 'morning', 'day', 'evening']
    while (allImages.length < 24) {
        let index = [];
        while (index.length < 6) {
            let i = Math.floor(Math.random() * 19) + 1;
            if (index.indexOf(i) === -1) {
                index.push(i);
                allImages.push(`https://raw.githubusercontent.com/irinainina/ready-projects/momentum/momentum/assets/images/${dayTime[0]}/${addZero(i)}.jpg`);
            }
        }
        dayTime.shift();
    }
    console.log(allImages);
}

function showDateAndTime() {
    let today = new Date(),
        dayOfWeek = namesOfDays[today.getDay()],
        month = namesOfMonth[today.getMonth()],
        dayOfMonth = today.getDate(),
        hour = today.getHours(),
        min = today.getMinutes(),
        sec = today.getSeconds();

    date.innerHTML = `${dayOfWeek}<span>, </span>${dayOfMonth} ${month}`;
    time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;

    setTimeout(showDateAndTime, 1000);
}

function addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

function setBgGreet() {
    let today = new Date(),
        hour = today.getHours();

    const wrapper = document.querySelector(".wrapper");
    wrapper.style.backgroundImage = `url(${allImages[hour]})`;
    currentImage = hour;

    if (hour < 6) {
        greeting.innerHTML = "Good night, ";
        wrapper.style.color = 'white';
    } else if (hour < 12) {
        greeting.innerHTML = "Good morning, ";
    } else if (hour < 18) {
        greeting.innerHTML = "Good afternoon, ";
    } else {
        greeting.innerHTML = "Good evening, "
        wrapper.style.color = 'white';
    }

    setTimeout(setBgGreet, 3600000);
}

function setName(e) {
    if (e.type === 'keypress') {
        if (e.which == 13 || e.keyCode == 13) {
            console.log(!e.target.innerText.toString().trim() == '')
            if (!e.target.innerText.toString().trim() == '') {
                localStorage.setItem('name', e.target.innerText);
            }
            name.blur();
        }
    } else {
        if (e.target.innerText.toString().trim() == '') {
            getName();
        }
    }

}

function getName() {
    if (localStorage.getItem('name') === null) {
        name.textContent = '[Enter Name]';
    } else {
        name.textContent = localStorage.getItem('name');
    }
}

function clear(e) {
    e.target.innerText = "";
}

function setFocus(e) {
    if (e.type === 'keypress') {
        if (e.which == 13 || e.keyCode == 13) {
            console.log(e.target.innerText);
            if (!e.target.innerText.toString() !== "") {
                localStorage.setItem('focus', e.target.innerText);
            }
            focus.blur();
        }
    } else {
        if (e.target.innerText.toString().trim() == '') {
            getFocus();
        }
    }

}

function getFocus() {
    if (localStorage.getItem('focus') === null) {
        focus.textContent = '[Enter Focus]';
    } else {
        focus.textContent = localStorage.getItem('focus');
    }
}

function viewBgImage() {
    changeImageButton.disabled = true;
    const wrapper = document.querySelector('.wrapper');
    currentImage++;
    if (currentImage >= allImages.length) {
        currentImage = 0;
    }
    const src = allImages[currentImage];
    const img = document.createElement('img');
    img.src = src;
    img.onload = () => {
        wrapper.style.backgroundImage = `url(${src})`;
    };
    changeImageButton.disabled = false;
}

async function getQuote() {
    const url = `https://quote-garden.herokuapp.com/api/v2/quotes/random`;
    const res = await fetch(url);
    const data = await res.json();
    blockquote.textContent = data.quote.quoteText;
    figcaption.textContent = data.quote.quoteAuthor;
}

function setLocationName(e) {
    if (e.type === 'keypress') {
        if (e.which == 13 || e.keyCode == 13) {
            console.log(e.target.innerText);
            if (!e.target.innerText.toString() !== "") {
                localStorage.setItem('location', e.target.innerText);
                getWeather(localStorage.getItem('location'));
            }
            focus.blur();
        }
    } else {
        if (e.target.innerText === '') {
            getLocation();
        }
    }
}

function getLocation() {
    if (localStorage.getItem('location') === null) {
        locationName.textContent = '[Please enter location]';
    } else {
        locationName.textContent = localStorage.getItem('location');
        getWeather(localStorage.getItem('location'));
    }
}

async function getWeather(loc) {
    const url = `https://api.weatherapi.com/v1/current.json?key=ecfe700e1a9a42f394f175145202510&q=${loc}`;
    const res = await fetch(url);
    const data = await res.json();
    locationName.textContent = data.location.name;
    temperature.textContent = `${data.current.temp_c} °C`;
    weatherIcon.src = `${data.current.condition.icon}`;
    windSpeed.textContent = `Wind Speed: ${data.current.wind_kph} kph`;
    humidity.textContent = `Humidity: ${data.current.humidity}%`;


}


document.addEventListener('DOMContentLoaded', getQuote);
blockButton.addEventListener('click', getQuote);

document.addEventListener('DOMContentLoaded', getLocation);
locationName.addEventListener('keypress', setLocationName);
locationName.addEventListener('blur', setLocationName);
locationName.addEventListener('click', clear);

name.addEventListener('click', clear);
name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);
focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);
focus.addEventListener('click', clear);
changeImageButton.addEventListener('click', viewBgImage);


getImage();
setBgGreet();
showDateAndTime();
getName();
getFocus();