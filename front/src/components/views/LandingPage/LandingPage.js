import React, { useState } from 'react';
import { Calendar, Badge, Popover } from 'antd';
import './LandingPage.css'

function getListData(value) {
  let listData;
  switch (value.date()) {
    case 8:
      listData = [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'success', content: 'This is usual event.' },
      ];
      break;
    case 10:
      listData = [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'success', content: 'This is usual event.' },
        { type: 'error', content: 'This is error event.' },
      ];
      break;
    case 15:
      listData = [
        { type: 'warning', content: 'This is warning event' },
        { type: 'success', content: 'This is very long usual event。。....' },
        { type: 'error', content: 'This is error event 1.' },
        { type: 'error', content: 'This is error event 2.' },
        { type: 'error', content: 'This is error event 3.' },
        { type: 'error', content: 'This is error event 4.' },
      ];
      break;
    default:
  }
  return listData || [];
}

function dateCellRender(value, clickPopOver) {
  const listData = getListData(value);
  let click = false;
  console.log(value);
  if (Object.keys(clickPopOver.value).length !== 0 && clickPopOver.click) {
    if(value._d.getDate() === clickPopOver.value._d.getDate()) {
      if(value._d.getMonth() === clickPopOver.value._d.getMonth()){
        click = true;
      }
    } 
  }
  
  return (
    <div>

<Popover content={content} trigger='click' visible={click}>
      </Popover>
      <ul className="events">
        {listData.map(item => (
          <li key={item.content}>
            <span style={{fontSize: '0.6rem'}}>SIAC</span>
          </li>
        ))}
      </ul>
    </div>
     
    
  );
}

function getMonthData(value) {
  if (value.month() === 8) {
    return 1394;
  }
}

function monthCellRender(value) {
  const num = getMonthData(value);
  return num ? (
    <div className="notes-month">
      <section>{num}</section>
      <span>Backlog number</span>
    </div>
  ) : null;
}

const content = (
  <div>
    <p>Contentddddddddddddddddddddddddddd</p>
    <a href="https://www.youtube.com/">Contentdddddddddddddddddddddddddd</a>
  </div>
);

const showPopOver = (date) => {
  console.log(date);

  return (
    <Popover content={content}>
    </Popover>
  )
}

function LandingPage() {

    const [clickPopOver, setClickPopOver] = useState({value: { }, click: false})
    
    return (
      <div className='container'>
        <span>COHO</span>
          <Calendar className="calendar" dateCellRender={(value) => dateCellRender(value, clickPopOver)} monthCellRender={monthCellRender} onSelect={(m) => {setClickPopOver({value: m, click: !clickPopOver.click})}}/>
      </div>
    )
}

export default LandingPage
