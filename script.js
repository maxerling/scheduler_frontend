"use strict";
/* GLOBAL */
var loggedUser;
/* ---- */
setup();
async function setup() {
    checkCurrentWeek();
    setupCalenderButtons();
    await getAllEvents();
    welcomeMessage(loggedUser);
}
async function getAllEvents() {
    await fetch('./users.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
        .then(data => loggedUser = data[0])
        .catch((err) => console.log(err));
    console.log(loggedUser);
    loggedUser.bookedAppointments.map((event) => {
        console.log(event.date);
    });
}
function welcomeMessage(loggedUser) {
    let welcomeMessage = document.getElementById('welcome-message');
    welcomeMessage.textContent = `Welcome ${loggedUser.first_name}` ?? '';
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
