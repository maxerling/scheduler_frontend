
checkCurrentWeek();






function checkCurrentWeek() : void {
  for (let i = 0; i < 2 ; i++) {
    if (!todaysDateHighlight()) {

    } else {
      
    }

    moveForwardWeek()
  }
  

  
}


function moveForwardWeek() : void {
    const weekdayParentEle  = document.getElementById('weekdays-name');
    const monthAndYearEle = document.getElementById('cal-month');
    const monthAndYearArray : string[] = monthAndYearEle?.textContent?.split(' ') ?? [];
    const weekdayAndMonthArray : string[] = weekdayParentEle?.children[1]?.textContent?.split(' ') ?? [];


    const weekday : number = Number(weekdayAndMonthArray[1].substring(0,2));
    //const month : number = Number(weekdayAndMonthArray[1].substring(3))

    const randDate : Date = new Date(`${monthAndYearArray[0]} ${weekday}, ${monthAndYearArray[1]}`);
    console.log(randDate)
    let randDatePlusOne : Date = new Date(randDate);
    randDatePlusOne.setDate(randDate.getDate())

    const randDateFArray : string[] = randDate.toString().split(' '); 

    randDateFArray[1] = randDatePlusOne.toLocaleString('default', {month: 'long'});
    weekdayParentEle!.children[1].textContent = `${randDateFArray[0].toUpperCase()} ${randDateFArray[2]}/${randDate.getMonth()+1}`;
    monthAndYearEle!.textContent! = `${randDateFArray[1]} ${randDateFArray[3]}`;

    for (let i = 2; i < 8; i++) {
      randDatePlusOne.setDate(randDatePlusOne.getDate()+1)
      const dateOWFPlusOneArray : string[] = randDatePlusOne.toString().split(' '); 
      weekdayParentEle!.children[i].textContent = `${dateOWFPlusOneArray[0].toUpperCase()} ${dateOWFPlusOneArray[2]}/${randDatePlusOne.getMonth()+1}`;
 
      
    }

 
  
  // change current mon to randDateOneWeekForward, test it with wrong dates, implement for all days with loop, 
  
  //extra: change so the default date is based on current day (ex: day-1 is the closest mon)
}

function calenderButtonNext() : void {
  const nextButton = document.getElementById('cal-next');
  nextButton?.addEventListener('click', () => {
    
  });
  const today = new Date();
  const nextWeek = new Date(today.getFullYear(),today.getMonth(),today.getDate()+7);
  console.log(nextWeek);

};


function todaysDateHighlight() : boolean {
  const today : Date  = new Date();
  const splittedString : string[] = today.toString().split(' ');
  let eleNum : number;
  if ((eleNum = checkDay(splittedString[0] + ' ' + splittedString[2])) != -1) {
    const todayEle = document.getElementById(`day-${eleNum}`);
    todayEle?.classList.add('selected')
    return true;
  }

  return false;
 
};



function checkMonth(currentMonth : string) : boolean {
  const monthEle = document.getElementById('cal-month');
  if (monthEle?.textContent!.includes(currentMonth)) {
    return true;
  }

  return false;

};
function checkDay(currentDay : string) : number {
  const currentWeek : string[] = document?.querySelector('.cal-head')?.childNodes[1]?.textContent?.split(`\n`) ?? [];
  for (let i : number = 0; i < currentWeek.length; i++) {
    if (currentWeek[i].includes(`${currentDay.toUpperCase()}`)) {
      return (i-1);
    }
  }
  
  
  return -1;
};



export = {};