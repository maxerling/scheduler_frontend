"use strict";
checkCurrentWeek();
function checkCurrentWeek() {
    for (let i = 0; i < 1; i++) {
        if (!todaysDateHighlight()) {
            //moveForwardWeek()
        }
        else {
            //moveForwardWeek()
        }
        moveForwardWeek();
        console.log('dd');
    }
}
function moveForwardWeek() {
    const weekdayParentEle = document.getElementById('weekdays-name');
    const monthAndYearEle = document.getElementById('cal-month');
    const monthAndYearArray = monthAndYearEle?.textContent?.split(' ') ?? [];
    console.log(weekdayParentEle);
    console.log(monthAndYearEle);
    console.log(monthAndYearArray);
    for (let i = 1; i < 8; i++) {
        const weekday = Number(weekdayParentEle?.children[i]?.textContent?.split(' ')[1].substring(0, 2));
        const randDate = new Date(`${monthAndYearArray[0]} ${weekday}, ${monthAndYearArray[1]}`);
        const randDateOneWeekForward = new Date(randDate.getFullYear(), randDate.getMonth(), randDate.getDate() + 7);
        const dateOWFArray = randDateOneWeekForward.toString().split(' ');
        dateOWFArray[1] = randDateOneWeekForward.toLocaleString('default', { month: 'long' });
        weekdayParentEle.children[i].textContent = `${dateOWFArray[0].toUpperCase()} ${dateOWFArray[2]}/${randDateOneWeekForward.getMonth() + 1}`;
        monthAndYearEle.textContent = `${dateOWFArray[1]} ${dateOWFArray[3]}` ?? '';
    }
    // change current mon to randDateOneWeekForward, test it with wrong dates, implement for all days with loop, 
    //extra: change so the default date is based on current day (ex: day-1 is the closest mon)
}
function calenderButtonNext() {
    const nextButton = document.getElementById('cal-next');
    nextButton?.addEventListener('click', () => {
    });
    const today = new Date();
    const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    console.log(nextWeek);
}
;
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
