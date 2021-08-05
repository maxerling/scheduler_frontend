

interface User {
  id : number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  active: boolean;
  bookedAppointments: BookingAppointments[];
  date: string;

}


interface BookingAppointments {
  id: number;
  name: string;
  description: string;
  start_time : string;
  end_time : string;
  date: string;
}


/* GLOBAL */
var loggedUser : User;


/* ---- */

setup()

async function setup() {

  checkCurrentWeek();
  setupCalenderButtons()
  await getAllEvents();
  welcomeMessage(loggedUser);
}


async function getAllEvents() : Promise<void> {
   await fetch('./users.json', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          
        }
      }).then(response => response.json())
      .then(data => loggedUser = data[0])
      .catch((err) => console.log(err));

      console.log(loggedUser);
      loggedUser.bookedAppointments.map((event : BookingAppointments) : void => {
        const weekdayParentEle = document.getElementById('weekdays-name');
        const monthAndYearEle = document.getElementById('cal-month');
        let splittedEventDate : string[] = event.date.split('-');
        let splittedMonthAndYear : string[] = monthAndYearEle?.textContent?.split(' ') ?? [];
        let eventDateWeekend = `${splittedEventDate[2]}/${splittedEventDate[1][1]}`;
        if ((getMonth(Number(splittedEventDate[1][1])) === splittedMonthAndYear[0] && splittedEventDate[0] === splittedMonthAndYear[1] )) {
          console.log(event)
          for (let i = 0; i < 7; i++) {
            if (weekdayParentEle!.children[i+1].textContent?.includes(eventDateWeekend) {
              const eventCollectionEle = document.getElementById(`day-${i+1}`);
              const eventEle = document.createElement('div');
              eventEle.classList.add('event');
              eventEle.style.backgroundColor = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6);
              eventEle.style.height = '50.198px'
              const name = event.name;
              const description = event.description;
              const start_time = event.start_time;
              const end_time = event.end_time;
              const nameEle = document.createElement('p');
              const timeEle = document.createElement('h6') 
              timeEle.textContent = `${start_time}-${end_time}`;
              nameEle.textContent = `${name}`
              




              
              eventEle.append(nameEle);
              eventEle.append(timeEle);
            
              
              eventCollectionEle?.append(eventEle)
            }
            
          }

        }

      }); 
      

}

function welcomeMessage(loggedUser : User) : void {
  let welcomeMessage = document.getElementById('welcome-message');
  welcomeMessage!.textContent = `Welcome ${loggedUser.first_name}` ?? '';
}


function checkCurrentWeek() : void {
  while (!todaysDateHighlight()) {
    moveWeek(7)
  }


  
  
}



function moveWeek(weekAmount : number) : void {

  const eventParent = document.getElementById('event-scheduler');

  for (let i = 1; i < 8; i++) {
    eventParent!.children[i].textContent = '';
    eventParent!.children[i].classList.remove('selected');
  }
  const weekdayParentEle  = document.getElementById('weekdays-name');
  const monthAndYearEle = document.getElementById('cal-month');
  const monthAndYearArray : string[] = monthAndYearEle?.textContent?.split(' ') ?? [];
  const weekdayAndMonthArray : string[] = weekdayParentEle?.children[1]?.textContent?.split(' ') ?? [];


  const weekday : number = Number(weekdayAndMonthArray[1].substring(0,2));
  const month : number = Number(weekdayAndMonthArray[1].substring(3))

  const randDate : Date = new Date(`${getMonth(month)} ${weekday}, ${monthAndYearArray[1]}`);
  let randDatePlusOne : Date = new Date(randDate);
  randDatePlusOne.setDate(randDatePlusOne.getDate() + weekAmount)

  const randDateFArray : string[] = randDatePlusOne.toString().split(' '); 


  randDateFArray[1] = randDatePlusOne.toLocaleString('default', {month: 'long'});
  weekdayParentEle!.children[1].textContent = `${randDateFArray[0].toUpperCase()} ${randDateFArray[2]}/${randDatePlusOne.getMonth()+1}`;
  monthAndYearEle!.textContent! = `${randDateFArray[1]} ${randDateFArray[3]}`;
  
  
  for (let i = 1; i < 7; i++) {
    randDatePlusOne.setDate(randDatePlusOne.getDate()+1)
    const dateOWFPlusOneArray : string[] = randDatePlusOne.toString().split(' '); 
    weekdayParentEle!.children[i+1].textContent = `${dateOWFPlusOneArray[0].toUpperCase()} ${dateOWFPlusOneArray[2]}/${randDatePlusOne.getMonth()+1}`;
    
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

function setupCalenderButtons() {
  const nextButton = document.getElementById('cal-next')!
  const prevButton = document.getElementById('cal-prev')!; 
  calenderButton(nextButton, 7);
  calenderButton(prevButton, -7);
}

function calenderButton(button : HTMLElement, weekAmount : number) : void {

  button?.addEventListener('click', () => {
    moveWeek(weekAmount)
    todaysDateHighlight()
  });

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