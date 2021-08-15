"use strict";
/* GLOBAL */
var loggedUser;
/* ---- */
setup();
async function setup() {
    redirectNotUser();
    await getData();
    checkCurrentWeek();
    setupCalenderButtons();
    welcomeMessage(loggedUser);
    onClickTimeAddEvent();
    logOutButton();
    addEventSubmit();
}
function addEventSubmit() {
    const addEventForm = document.getElementById('add-event');
    const nameInput = addEventForm?.children[0].children[1].children[0];
    const dateInput = addEventForm?.children[1].children[1].children[0];
    const startTimeInput = addEventForm?.children[2].children[1].children[0];
    const endTimeInput = addEventForm?.children[3].children[1].children[0];
    const descInput = addEventForm?.children[4].children[1].children[0];
    const submitBtn = addEventForm?.children[5];
    const erroerMessages = document.getElementsByClassName('error-message');
    submitBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isEmptyValidaiton(addEventForm, erroerMessages)) {
            const body = {
                'name': `${nameInput.value}`,
                'date': `${dateInput.value}`,
                'start_time': `${startTimeInput.value}`,
                'end_time': `${endTimeInput.value}`,
                'description': `${descInput.value}`,
                'user': {
                    "id": loggedUser.id,
                    "username": loggedUser.username,
                },
            };
            fetch('http://localhost:8080/event/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt') ?? '')}`,
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify(body)
            });
        }
    });
}
function isEmptyValidaiton(addEventForm, errorMessage) {
    let j = 0;
    for (let i = 0; i < 4; i++) {
        const field = addEventForm?.children[i].children[1].children[0];
        if (!isEmptyField(field.value)) {
            errorMessage[i].style.display = 'none';
        }
        else {
            errorMessage[i].style.display = 'flex';
            errorMessage[i].textContent = 'This field is required';
            j++;
        }
    }
    if (j > 0) {
        return true;
    }
    return false;
}
function isEmptyField(valueField) {
    if (valueField == '') {
        return true;
    }
    return false;
}
function redirectNotUser() {
    const user = localStorage.getItem('user');
    const jwt = localStorage.getItem('jwt');
    if (user == null && jwt == null) {
        window.location.replace("http://localhost:3000/login.html");
    }
}
function logOutButton() {
    const logoutBtn = document.getElementById('logout');
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        window.location.replace('http://localhost:3000/login.html');
    });
}
async function getData() {
    const username = JSON.parse(localStorage.getItem('user') ?? '');
    await fetch(`http://localhost:8080/user/${username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt') ?? '')}`,
            'Access-Control-Allow-Origin': '*'
        }
    }).then(response => response.json())
        .then(data => loggedUser = data)
        .catch((err) => console.log(err));
}
function onClickTimeAddEvent() {
    const timeTable = document.getElementsByClassName('td-time');
    const modalEle = document.getElementsByClassName('modal')[1];
    const closeButton = document.getElementsByClassName('delete');
    let startTimeInput = document.getElementById('start-time');
    for (let i = 0; i < timeTable.length; i++) {
        timeTable[i].addEventListener('click', () => {
            startTimeInput.value = timeTable[i].textContent ?? '';
            modalEle.classList.add('is-active');
        });
    }
    closeButton[1].addEventListener('click', () => modalEle.classList.remove('is-active'));
}
async function createEventElements() {
    loggedUser.bookedAppointments.map((event) => {
        const weekdayParentEle = document.getElementById('weekdays-name');
        const monthAndYearEle = document.getElementById('cal-month');
        let splittedEventDate = event.date.split('-');
        let splittedMonthAndYear = monthAndYearEle?.textContent?.split(' ') ?? [];
        let eventDateWeekend = `${splittedEventDate[2]}/${splittedEventDate[1][1]}`;
        if ((getMonth(Number(splittedEventDate[1][1])) === splittedMonthAndYear[0] && splittedEventDate[0] === splittedMonthAndYear[1])) {
            for (let i = 0; i < 7; i++) {
                if (weekdayParentEle.children[i + 1].textContent?.includes(eventDateWeekend)) {
                    const eventCollectionEle = document.getElementById(`day-${i + 1}`);
                    const eventEle = document.createElement('div');
                    eventEle.classList.add('event');
                    eventEle.style.backgroundColor = '#000';
                    eventEle.style.height = '50.198px';
                    const name = event.name;
                    const description = event.description;
                    const start_time = event.start_time;
                    const end_time = event.end_time;
                    const nameEle = document.createElement('p');
                    const timeEle = document.createElement('h6');
                    timeEle.textContent = `${start_time}-${end_time}`;
                    nameEle.textContent = `${name}`;
                    const timePositionAttArray = timePosition(start_time, end_time);
                    eventEle.style.top = `${timePositionAttArray[0]}px`;
                    eventEle.style.height = `${timePositionAttArray[1]}px`;
                    eventEle.append(nameEle);
                    eventEle.append(timeEle);
                    eventCollectionEle?.append(eventEle);
                    onClickEvent(event, eventEle);
                }
            }
        }
    });
}
function onClickEvent(event, eventEle) {
    const modalEle = document.getElementsByClassName('modal')[0];
    const modalCardHeadEle = document.getElementsByClassName('modal-card')[0].children[0];
    const modalCardBodyEle = document.getElementsByClassName('modal-card')[0].children[1];
    eventEle.addEventListener('click', () => {
        modalCardHeadEle.children[0].textContent = event.name;
        modalCardBodyEle.children[0].firstChild.textContent = `${event.start_time}-${event.end_time}`;
        modalCardBodyEle.children[0].lastChild.textContent = `${event.date}`;
        modalCardBodyEle.children[1].textContent = `${event.description}`;
        modalEle.classList.add('is-active');
    });
    modalCardHeadEle.children[1].addEventListener('click', () => modalEle.classList.remove('is-active'));
}
function welcomeMessage(loggedUser) {
    let welcomeMessage = document.getElementById('welcome-message');
    welcomeMessage.textContent = `Welcome ${loggedUser.first_name}` ?? '';
}
function timePosition(startTime, endTime) {
    let startAndEndAttr = [];
    let startTimeValue = startTime.substr(0, 2);
    let endTimeValue = endTime.substr(0, 2);
    if (startTimeValue == '00') {
        startTimeValue = '24';
    }
    else if (endTimeValue == '00') {
        endTimeValue = '24';
    }
    startAndEndAttr.push((151 + (Number(startTimeValue.replace('0', '')) - 4) * 50).toString());
    startAndEndAttr.push(((Number(endTimeValue.substr(0, 2).replace('0', '')) - Number(startTime.substr(0, 2).replace('0', ''))) * 51).toString());
    return startAndEndAttr;
}
function checkCurrentWeek() {
    while (!todaysDateHighlight()) {
        moveWeek(7);
    }
}
function moveWeek(weekAmount) {
    const eventParent = document.getElementById('event-scheduler');
    for (let i = 1; i < 8; i++) {
        eventParent.children[i].textContent = '';
        eventParent.children[i].classList.remove('selected');
    }
    const weekdayParentEle = document.getElementById('weekdays-name');
    const monthAndYearEle = document.getElementById('cal-month');
    const monthAndYearArray = monthAndYearEle?.textContent?.split(' ') ?? [];
    const weekdayAndMonthArray = weekdayParentEle?.children[1]?.textContent?.split(' ') ?? [];
    const weekday = Number(weekdayAndMonthArray[1].substring(0, 2));
    const month = Number(weekdayAndMonthArray[1].substring(3));
    const randDate = new Date(`${getMonth(month)} ${weekday}, ${monthAndYearArray[1]}`);
    let randDatePlusOne = new Date(randDate);
    randDatePlusOne.setDate(randDatePlusOne.getDate() + weekAmount);
    const randDateFArray = randDatePlusOne.toString().split(' ');
    randDateFArray[1] = randDatePlusOne.toLocaleString('default', { month: 'long' });
    weekdayParentEle.children[1].textContent = `${randDateFArray[0].toUpperCase()} ${randDateFArray[2]}/${randDatePlusOne.getMonth() + 1}`;
    monthAndYearEle.textContent = `${randDateFArray[1]} ${randDateFArray[3]}`;
    for (let i = 1; i < 7; i++) {
        randDatePlusOne.setDate(randDatePlusOne.getDate() + 1);
        const dateOWFPlusOneArray = randDatePlusOne.toString().split(' ');
        weekdayParentEle.children[i + 1].textContent = `${dateOWFPlusOneArray[0].toUpperCase()} ${dateOWFPlusOneArray[2]}/${randDatePlusOne.getMonth() + 1}`;
    }
    createEventElements();
    //extra: change so the default date is based on current day (ex: day-1 is the closest mon)
}
function getMonth(month) {
    if (month === 1) {
        return 'January';
    }
    else if (month === 2) {
        return 'February';
    }
    else if (month === 3) {
        return 'March';
    }
    else if (month === 4) {
        return 'April';
    }
    else if (month === 5) {
        return 'May';
    }
    else if (month === 6) {
        return 'June';
    }
    else if (month === 7) {
        return 'July';
    }
    else if (month === 8) {
        return 'August';
    }
    else if (month === 9) {
        return 'September';
    }
    else if (month === 10) {
        return 'October';
    }
    else if (month === 11) {
        return 'November';
    }
    else if (month === 12) {
        return 'December';
    }
    return '';
}
function setupCalenderButtons() {
    const nextButton = document.getElementById('cal-next');
    const prevButton = document.getElementById('cal-prev');
    calenderButton(nextButton, 7);
    calenderButton(prevButton, -7);
}
function calenderButton(button, weekAmount) {
    button?.addEventListener('click', () => {
        moveWeek(weekAmount);
        todaysDateHighlight();
    });
}
;
function todaysDateHighlight() {
    const today = new Date();
    const splittedString = today.toString().split(' ');
    let eleNum;
    if ((eleNum = checkDay(splittedString[0] + ' ' + splittedString[2])) != -1) {
        const todayEle = document.getElementById(`day-${eleNum}`);
        todayEle?.classList.add('selected');
        return true;
    }
    return false;
}
;
function checkDay(currentDay) {
    const currentWeek = document?.querySelector('.cal-head')?.childNodes[1]?.textContent?.split(`\n`) ?? [];
    for (let i = 0; i < currentWeek.length; i++) {
        if (currentWeek[i].includes(`${currentDay.toUpperCase()}`)) {
            return (i - 1);
        }
    }
    return -1;
}
;
module.exports = {};
