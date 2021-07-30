"use strict";
var todaysDateHighlight = function () {
    var today = new Date();
    var splittedString = today.toString().split(' ');
    var eleNum;
    if (checkMonth(splittedString[1]) && ((eleNum = checkDay(splittedString[0] + ' ' + splittedString[2])) != -1)) {
        var todayEle = document.getElementById("day-" + eleNum);
        todayEle.classList.add('selected');
    }
};
todaysDateHighlight();
function checkMonth(currentMonth) {
    var monthEle = document.getElementById('cal-month');
    if (monthEle.textContent.includes(currentMonth)) {
        return true;
    }
    return false;
}
;
function checkDay(currentDay) {
    var currentWeek = document.querySelector('.cal-head').childNodes[1].textContent.split("\n");
    for (var i = 0; i < currentWeek.length; i++) {
        if (currentWeek[i].includes("" + currentDay.toUpperCase())) {
            return (i - 1);
        }
    }
    return -1;
}
;
module.exports = {};
