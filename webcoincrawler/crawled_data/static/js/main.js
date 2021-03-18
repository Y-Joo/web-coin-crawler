window.onload = function () {

let today = new Date();
const calendarBody = document.querySelector('.calendar-body');
const prevEl = document.querySelector('.prev');
const nextEl = document.querySelector('.next');
let currentDate;

function addnews(){
  var news_date=document.getElementById("2021-3-1")
  const new_text= document.createTextNode("Sia")
  const newdiv=document.createElement('div')
  newdiv.appendChild(new_text)
  news_date.appendChild(newdiv)
}

buildCalendar();
function buildCalendar() {
  let firstDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const leapYear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const notLeapYear = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const headerYear = document.querySelector('.current-year-month');
  // 윤년 체크하기
  if (firstDate.getFullYear() % 4 === 0) {
    pageYear = leapYear;
  } else {
    pageYear = notLeapYear;
  }
  headerYear.innerHTML = `${monthList[firstDate.getMonth()]}&nbsp;&nbsp;&nbsp;&nbsp;${today.getFullYear()}`;
  makeElement(firstDate);
  showMain();
  currentDateget();
  resetInsert();
}

function showMain() {
  const mainDay = document.querySelector('.main-day');
  const mainDate = document.querySelector('.main-date');
  const dayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  mainDay.innerHTML = dayList[today.getDay()];
  mainDate.innerHTML = today.getDate();
}

function makeElement(firstDate) {
  let weekly = 100;
  let dateSet = 1;
  for (let i = 0; i < 6; i++) {
    let weeklyEl = document.createElement('div');
    weeklyEl.setAttribute('class', weekly);
    weeklyEl.setAttribute('id', "weekly");
    for (let j = 0; j < 7; j++) {
      // i === 0이여야 하는 이유는 첫 날짜를 찍고 그 다음 날짜가 0번째 칸부터 다시 그려져야 하기 때문
      // firstDate.getMonth() => 현재 달의 일수가 몇일인지 반환해주고, 이 조건은 반환 된 값에 따라 출력해 준 후, 달력 출력 종료조건이다.
      if (i === 0 && j < firstDate.getDay() || dateSet > pageYear[firstDate.getMonth()]) {
        // 만약 해당 칸에 날짜가 없으면 div엘리먼트만 생성한다.
        let dateEl = document.createElement('div');
        weeklyEl.appendChild(dateEl);
      } else {
        // 해당 칸에 날짜가 있으면 div엘리먼트 생성 후 해당 날짜 넣어주기
        let dateEl = document.createElement('div');
        dateEl.textContent = dateSet;
        dateEl.setAttribute('class', dateSet);
        dateEl.setAttribute('id', `${today.format2()}-${dateSet}`);
        weeklyEl.appendChild(dateEl);
        dateSet++;
      }
    }
    weekly++;
    calendarBody.appendChild(weeklyEl);
  }
  // 현재 내가 선택한 날짜가 있으면 이전 달, 다음 달로 넘어가도 화면에 보여주기 위해 써줌
  let clickedDate = document.getElementsByClassName(today.getDate());
  clickedDate[0].classList.add('active');
}

function removeCalendar() {
  let divEls = document.querySelectorAll('.calendar-body > #weekly > div');
  for (let i = 0; i < divEls.length; i++) {
    divEls[i].remove();
  }
}

// 왼쪽에 현재 날짜 업데이트 해주기.
function showMain() {
  const mainDay = document.querySelector('.main-day');
  const mainDate = document.querySelector('.main-date');
  const dayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  mainDay.innerHTML = dayList[today.getDay()];
  mainDate.innerHTML = today.getDate();
}

prevEl.addEventListener('click', function () {
  today = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  removeCalendar();
  buildCalendar();
  resetInsert();
  redrawLi()
});
nextEl.addEventListener('click', function () {
  today = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
  removeCalendar();
  buildCalendar();
  resetInsert();
  redrawLi()
});

function currentDateget() {
  // format()을 이용해서 현재 날짜를 보기좋게 출력해주기 위해 사용.
  currentDate = today.format();
}

calendarBody.addEventListener('click', function (e) {
  let target = e.target;
  let eachDate = document.querySelectorAll('.calendar-body > #weekly > div');
  if (e.target.innerHTML === '') return;
  for (let i = 0; i < eachDate.length; i++) {
    eachDate[i].classList.remove('active');
  }
  target.classList.add('active');
  today = new Date(today.getFullYear(), today.getMonth(), target.innerHTML);
  showMain();
  currentDateget();
});


function save() {
  localStorage.setItem(currentDate, JSON.stringify(DATA[currentDate]));
}
addnews()
}