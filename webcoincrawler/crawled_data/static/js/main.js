window.onload = function () {

    let today = new Date();
    const calendarBody = document.querySelector('.calendar-body');
    const prevEl = document.querySelector('.prev');
    const nextEl = document.querySelector('.next');
    const detail= document.querySelector('.detail');
    let currentDate;

    buildCalendar();


    function addnews(key, id, coin_name) {
        var news_date = document.getElementById(id);
        const new_text = document.createTextNode(coin_name);
        const newdiv = document.createElement('div');
        newdiv.setAttribute('class', 'coin_name');
        const coin_title=coindict[key]["title"];
        const coin_detail=coindict[key]["detail"];
        newdiv.addEventListener('click', function(){
            detail.innerHTML=coin_title+'<br>'+'<br>'+coin_detail;
            detail.style.display='block';
        })
        newdiv.appendChild(new_text);
        newdiv.style.color = 'black';
        news_date.appendChild(newdiv);
    }

    function buildCalendar() {
        let firstDate = new Date(today.getFullYear(), today.getMonth(), 1);
        var tyear = firstDate.getFullYear()
        var tmonth = firstDate.getMonth() + 1
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
        for (var key in coindict) {
            if (coindict[key]["goodnewstime"][0] == tyear && coindict[key]["goodnewstime"][1] == tmonth) {
                var newid = coindict[key]["goodnewstime"].join('-');
                var newtext = coindict[key]["name"][1];
                addnews(key, newid, newtext);
            }
        }
        currentDateget();
    }


    function makeElement(firstDate) {
        let dateSet = 1;
        for (let i = 0; i < pageYear[firstDate.getMonth()]; i++) {
            let dateEl = document.createElement('div');
            dateEl.textContent = dateSet;
            dateEl.setAttribute('class', 'dateSet');
            dateEl.setAttribute('id', `${today.format2()}-${dateSet}`);
            dateSet++;
            calendarBody.appendChild(dateEl);
        }
    }

    function removeCalendar() {
        let divEls = document.querySelectorAll('.calendar-body > div');
        for (let i = 0; i < divEls.length; i++) {
            divEls[i].remove();
        }
    }

// 왼쪽에 현재 날짜 업데이트 해주기.

    prevEl.addEventListener('click', function () {
        today = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        removeCalendar();
        buildCalendar();
    });
    nextEl.addEventListener('click', function () {
        today = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
        removeCalendar();
        buildCalendar();
    });


    function currentDateget() {
        // format()을 이용해서 현재 날짜를 보기좋게 출력해주기 위해 사용.
        currentDate = today.format();
    }


    function save() {
        localStorage.setItem(currentDate, JSON.stringify(DATA[currentDate]));
    }

}