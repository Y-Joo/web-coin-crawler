window.onload = function () {

    let today = new Date();
    const calendarBody = document.querySelector('.calendar-body');
    const prevEl = document.querySelector('.prev');
    const nextEl = document.querySelector('.next');
    const detail= document.querySelector('.detail');
    let currentDate;
    var delay = 1000;

    buildCalendar();


    function addnews(key, key_2) {
        var news_date = document.getElementById(key);
        if (!news_date){
            return
        }
        const new_text = document.createTextNode(key_2);
        const newdiv = document.createElement('div');
        newdiv.setAttribute('class', 'coin_name');

        newdiv.appendChild(new_text);
        newdiv.style.color = 'black';
        news_date.appendChild(newdiv);
        newdiv.addEventListener('click', function(){
            detail.innerHTML="";
            let divEls = document.querySelectorAll('.detail > div');
            for (let i = 0; i < divEls.length; i++) {
                divEls[i].remove();
            }

            for (let i=0;i<posts[-1].coindict[key][key_2].length;i++){
                const dat=posts[-1].coindict[key][key_2][i];
                const coin_link=dat[0];
                const coin_title=dat[1];

                const link_text=document.createTextNode(coin_link);
                const link_div=document.createElement('div');
                link_div.appendChild(link_text);
                link_div.setAttribute('class', 'coin_link');
                link_div.addEventListener('click', function (){
                    window.open(coin_link);
                })
                detail.innerHTML+=coin_title+'<br>';
                detail.appendChild(link_div);
            }
            detail.style.display='block';
        })
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
        for (var key in posts[-1].coindict) {
            var cyear=key.split('-')[0];
            var cmonth=key.split('-')[1];
            if (cyear == tyear && cmonth == tmonth) {
                for (var key_2 in posts[-1].coindict[key]){
                    addnews(key, key_2);
                }
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
        $('.content-right').stop().animate({scrollLeft: 0}, delay);
    });
    nextEl.addEventListener('click', function () {
        today = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
        removeCalendar();
        buildCalendar();
        $('.content-right').stop().animate({scrollLeft: 0}, delay);
    });


    function currentDateget() {
        // format()을 이용해서 현재 날짜를 보기좋게 출력해주기 위해 사용.
        currentDate = today.format();
    }


    function save() {
        localStorage.setItem(currentDate, JSON.stringify(DATA[currentDate]));
    }

}