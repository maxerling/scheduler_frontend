todaysDateHighlight();












function todaysDateHighlight() : void {
  const today : Date  = new Date();
  const splittedString : string[] = today.toString().split(' ');
  let eleNum : number;
  if (checkMonth(splittedString[1]) && ( (eleNum = checkDay(splittedString[0] + ' ' + splittedString[2])) != -1)) {
    const todayEle = document.getElementById(`day-${eleNum}`);
    todayEle.classList.add('selected')
  }

 
};



function checkMonth(currentMonth : string) : boolean {
  const monthEle = document.getElementById('cal-month');
  if (monthEle.textContent.includes(currentMonth)) {
    return true;
  }

  return false;

};
function checkDay(currentDay : string) : number {
  const currentWeek = document.querySelector('.cal-head').childNodes[1].textContent.split(`\n`);
  for (let i : number = 0; i < currentWeek.length; i++) {
    if (currentWeek[i].includes(`${currentDay.toUpperCase()}`)) {
      return (i-1);
    }
  }
  
  
  return -1;
};



export = {};