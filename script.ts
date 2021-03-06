

interface User {
  id : number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  isActive: boolean;
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
  redirectNotUser()
  await getData();
  checkCurrentWeek();
  setupCalenderButtons()
  welcomeMessage(loggedUser);
  onClickTimeAddEvent();
  logOutButton();
  addEventSubmit();
}

function addEventSubmit() {
  const addEventForm = document.getElementById('add-event')!;
  const nameInput : HTMLInputElement = addEventForm?.children[0].children[1].children[0] as HTMLInputElement;
  const dateInput : HTMLInputElement  = addEventForm?.children[1].children[1].children[0] as HTMLInputElement;
  const startTimeInput : HTMLInputElement  = addEventForm?.children[2].children[1].children[0] as HTMLInputElement;
  const endTimeInput : HTMLInputElement  = addEventForm?.children[3].children[1].children[0] as HTMLInputElement;
  const descInput : HTMLInputElement  = addEventForm?.children[4].children[1].children[0] as HTMLInputElement;
  const submitBtn = addEventForm?.children[5];
  const erroerMessages = document.getElementsByClassName('error-message') as HTMLCollectionOf<HTMLElement>;

  submitBtn?.addEventListener('click', (e) => {
    e.preventDefault();
      if (!isEmptyValidaiton(addEventForm,erroerMessages)) {
        const body = {
          'name' : `${nameInput.value}`,
          'date' : `${dateInput.value}`,
          'start_time' : `${startTimeInput.value}`,
          'end_time' : `${endTimeInput.value}`,
          'description' : `${descInput.value}`,
          'user' : {
            "id" : loggedUser.id,
            "username" : loggedUser.username,
          },
        }

        fetch('http://localhost:8080/event/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${JSON.parse(localStorage.getItem('jwt') ?? '')}`,
            'Access-Control-Allow-Origin' : '*',        
          },
          body : JSON.stringify(body)
        })
      }
    
  })
}

function isEmptyValidaiton(addEventForm : HTMLElement ,errorMessage : HTMLCollectionOf<HTMLElement>) {
  let j = 0;
  for (let i = 0; i < 4; i++)  {
    const field = addEventForm?.children[i].children[1].children[0] as HTMLInputElement;
   if (!isEmptyField(field.value)) {
      errorMessage[i].style.display = 'none';
    } else {
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

function isEmptyField(valueField : string) {

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
  const logoutBtn = document.getElementById('logout')
  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    window.location.replace('http://localhost:3000/login.html')
  })
  
}

async function getData() {
  const username = JSON.parse(localStorage.getItem('user') ?? '');
  await fetch(`http://localhost:8080/user/${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${JSON.parse(localStorage.getItem('jwt') ?? '')}`,
      'Access-Control-Allow-Origin' : '*'
      
    }
  }).then(response => response.json())
  .then(data => loggedUser = data)
  .catch((err) => console.log(err));
}

function onClickTimeAddEvent() {
  const timeTable = document.getElementsByClassName('td-time');
  const modalEle = document.getElementsByClassName('modal')[1];
  const closeButton = document.getElementsByClassName('delete');
  let startTimeInput : HTMLInputElement  = document.getElementById('start-time') as HTMLInputElement;

  for (let i = 0; i < timeTable.length; i++) {
    timeTable[i].addEventListener('click', () => {
      startTimeInput.value = timeTable[i].textContent ?? '';
      modalEle.classList.add('is-active')
      
    })
  }
  closeButton[1].addEventListener('click', () => modalEle.classList.remove('is-active'));
 

}


async function createEventElements() : Promise<void> {

      
      loggedUser.bookedAppointments.map((event : BookingAppointments) : void => {
        const weekdayParentEle = document.getElementById('weekdays-name');
        const monthAndYearEle = document.getElementById('cal-month');
        let splittedEventDate : string[] = event.date.split('-');
        let splittedMonthAndYear : string[] = monthAndYearEle?.textContent?.split(' ') ?? [];
        let eventDateWeekend = `${splittedEventDate[2]}/${splittedEventDate[1][1]}`;
        if ((getMonth(Number(splittedEventDate[1][1])) === splittedMonthAndYear[0] && splittedEventDate[0] === splittedMonthAndYear[1] )) {
          
          for (let i = 0; i < 7; i++) {
            if (weekdayParentEle!.children[i+1].textContent?.includes(eventDateWeekend)) {
              const eventCollectionEle = document.getElementById(`day-${i+1}`);
              const eventEle = document.createElement('div');
              eventEle.classList.add('event');
              
              eventEle.style.backgroundColor = '#000';
              eventEle.style.height = '50.198px'
              const name = event.name;
              const description = event.description;
              const start_time = event.start_time;
              const end_time = event.end_time;
              const nameEle = document.createElement('p');
              const timeEle = document.createElement('h6') 
              timeEle.textContent = `${start_time}-${end_time}`;
              nameEle.textContent = `${name}`
              const timePositionAttArray = timePosition(start_time, end_time);
              eventEle.style.top = `${timePositionAttArray[0]}px`
              eventEle.style.height = `${timePositionAttArray[1]}px`

              
              eventEle.append(nameEle);
              eventEle.append(timeEle);

            
              eventCollectionEle?.append(eventEle)
              
              onClickEvent(event, eventEle)
            }
            
          }
        }

      }); 
      

}

function onClickEvent(event : BookingAppointments, eventEle : HTMLDivElement) {
    const modalEle = document.getElementsByClassName('modal')[0];
    const modalCardHeadEle = document.getElementsByClassName('modal-card')[0].children[0]
    const modalCardBodyEle = document.getElementsByClassName('modal-card')[0].children[1]

    
    eventEle.addEventListener('click',() => {
      modalCardHeadEle.children[0].textContent = event.name;
      modalCardBodyEle.children[0].firstChild!.textContent = `${event.start_time}-${event.end_time}` ;
      modalCardBodyEle.children[0].lastChild!.textContent = `${event.date}`;
      modalCardBodyEle.children[1].textContent = `${event.description}`;
      
      modalEle.classList.add('is-active');} );
    modalCardHeadEle.children[1].addEventListener('click',() => modalEle.classList.remove('is-active'));

    

}

function welcomeMessage(loggedUser : User) : void {
  let welcomeMessage = document.getElementById('welcome-message');
  welcomeMessage!.textContent = `Welcome ${loggedUser.first_name}` ?? '';
}

function timePosition(startTime : string, endTime : string ) : string[] {
  let startAndEndAttr : string[] = [];
  let startTimeValue = startTime.substr(0,2);
  let endTimeValue = endTime.substr(0,2)
  
  if (startTimeValue == '00') {
    startTimeValue = '24'
  } else if (endTimeValue == '00') {
    endTimeValue = '24'
  }
  startAndEndAttr.push((151+(Number(startTimeValue.replace('0',''))-4)*50).toString());
  startAndEndAttr.push(((Number(endTimeValue.substr(0,2).replace('0',''))-Number(startTime.substr(0,2).replace('0','')))*51).toString())
  return startAndEndAttr
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

  createEventElements();
 
  
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