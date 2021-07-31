"use strict";
checkCurrentWeek();
function checkCurrentWeek() {
    for (let i = 0; i < 3; i++) {
        if (!todaysDateHighlight()) {
            moveForwardWeek();
        }
    }
}
function moveForwardWeek() {
    const weekdayParentEle = document.getElementById('weekdays-name');
    const monthAndYearEle = document.getElementById('cal-month');
    const p = document.createElement("p");
    p.textContent = "Hello, World!";
    const monthAndYearArray = monthAndYearEle?.textContent?.split(' ') ?? [];
    const weekday = Number(weekdayParentEle?.children[1]?.textContent?.split(' ')[1].substring(0, 2));
    const randDate = new Date(`${monthAndYearArray[0]} ${weekday}, ${monthAndYearArray[1]}`);
    const randDateOneWeekForward = new Date(randDate.getFullYear(), randDate.getMonth(), randDate.getDate() + 7);
    console.log(randDateOneWeekForward);
    const dateOWFArray = randDateOneWeekForward.toString().split(' ');
    dateOWFArray[1] = randDateOneWeekForward.toLocaleString('default', { month: 'long' });
    weekdayParentEle.children[1].textContent = `${dateOWFArray[0].toUpperCase()} ${dateOWFArray[2]}/${randDateOneWeekForward.getMonth() + 1}`;
    monthAndYearEle.textContent = `${dateOWFArray[1]} ${dateOWFArray[3]}` ?? '';
    // change current mon to randDateOneWeekForward, test it with wrong dates, implement for all days with loop, 
    //extra: change so the default date is based on current day (ex: day-1 is the closest mon)
}
function todaysDateHighlight() {
    const today = new Date();
    const splittedString = today.toString().split(' ');
    let eleNum;
    if (checkMonth(splittedString[1]) && ((eleNum = checkDay(splittedString[0] + ' ' + splittedString[2])) != -1)) {
        const todayEle = document.getElementById(`day-${eleNum}`);
        todayEle?.classList.add('selected');
        return true;
    }
    return false;
}
;
function checkMonth(currentMonth) {
    const monthEle = document.getElementById('cal-month');
    if (monthEle?.textContent.includes(currentMonth)) {
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
