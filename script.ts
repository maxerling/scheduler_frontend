
checkCurrentWeek();






function checkCurrentWeek() : void {
  for (let i = 0; i < 1 ; i++) {
    if (todaysDateHighlight()) {

    } else {
      //moveForwardWeek()
    }

    moveForwardWeek()
  }
  
}


function moveForwardWeek() : void {
  const eventParent = document.getElementById('event-scheduler');

  const weekdayParentEle  = document.getElementById('weekdays-name');
  const monthAndYearEle = document.getElementById('cal-month');
  const monthAndYearArray : string[] = monthAndYearEle?.textContent?.split(' ') ?? [];
  const weekdayAndMonthArray : string[] = weekdayParentEle?.children[1]?.textContent?.split(' ') ?? [];


  const weekday : number = Number(weekdayAndMonthArray[1].substring(0,2));
  const month : number = Number(weekdayAndMonthArray[1].substring(3))

  const randDate : Date = new Date(`${getMonth(month)} ${weekday}, ${monthAndYearArray[1]}`);
  let randDatePlusOne : Date = new Date(randDate);
  randDatePlusOne.setDate(randDatePlusOne.getDate() + 7)

  const randDateFArray : string[] = randDatePlusOne.toString().split(' '); 


  randDateFArray[1] = randDatePlusOne.toLocaleString('default', {month: 'long'});
  weekdayParentEle!.children[1].textContent = `${randDateFArray[0].toUpperCase()} ${randDateFArray[2]}/${randDatePlusOne.getMonth()+1}`;
  monthAndYearEle!.textContent! = `${randDateFArray[1]} ${randDateFArray[3]}`;
  
  
  for (let i = 1; i < 7; i++) {
    randDatePlusOne.setDate(randDatePlusOne.getDate()+1)
    const dateOWFPlusOneArray : string[] = randDatePlusOne.toString().split(' '); 
    weekdayParentEle!.children[i+1].textContent = `${dateOWFPlusOneArray[0].toUpperCase()} ${dateOWFPlusOneArray[2]}/${randDatePlusOne.getMonth()+1}`;
    eventParent!.children[i].textContent = '';
    
  }

 
  
  //extra: change so the default date is based on current day (ex: day-1 is the closest mon)
}

function getMonth(month : number) : string {
  if (month === 1) {
    return 'January';
  } else if (month === 2) {
    return 'February';
  } else if (month === 3) {
    return 'March';
  } else if (month === 4) {
    return 'April';
  } else if (month === 5) {
    return 'May';
  } else if (month === 6) {
    return 'June';
  } else if (month === 7) {
    return 'July';
  } else if (month === 8) {
    return 'August';
  } else if (month === 9) {
    return 'September';
  } else if (month === 10) {
    return 'October';
  } else if (month === 11) {
    return 'November';
  } else if (month === 12) {
    return 'December';
  }

  return '';
    


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