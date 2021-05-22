import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Button, Modal, Divider } from 'antd';
import './LandingPage.css'

const axios = require('axios');


function LandingPage() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [coinData, setcoinData] = useState({});
    const [selectedKey, setSelectedKey] = useState("");
    const [isModalDetailVisible, setIsModalDetailVisible] = useState(false);
    const [selectedDetailKey, setSelectedDetailKey] = useState("");

    useEffect(() => {
      axios.get('/api/getCoinData')
            .then((response) => {
              setcoinData(JSON.parse(response.data[0].content));
            })
            .catch((err) => {
              console.log(err);
            });
    }, [])

    function dateCellRender(value, clickPopOver) {
      let tmpKey = value.year() + '-' + String(Number(value.month())+1) + '-' + value.date();
      // console.log(coinData[tmpKey]);

      let listData = [];
      for (var key in coinData[tmpKey]) {
        listData.push({content: key});
      }

      return (
        <ul className="events">
          {listData.map(item => (
            <li key={item.content}>
              <span style={{fontSize: '0.6rem'}}>{item.content}</span>
            </li>
          ))}
        </ul>
      );
    }
    
    function getMonthData(value) {

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

    const onClickCalendar = (value) => {
      setSelectedKey(value.year() + '-' + String(Number(value.month())+1) + '-' + value.date());
      showModal();
    }

    const showModal = () => {
      setIsModalVisible(true);
    };
    
    const handleOk = () => {
      setIsModalVisible(false);
      setIsModalDetailVisible(false);
    };
    
    const handleCancel = () => {
      setIsModalVisible(false);
      setIsModalDetailVisible(false);
    };
    
    const modal = () => {
      // console.log(coinData);
      if (isModalDetailVisible) {
        let listData = [];
          for (var keyDate in coinData) {
            if (selectedDetailKey in coinData[keyDate]) {
              for (var indx in coinData[keyDate][selectedDetailKey]) {
                let url = coinData[keyDate][selectedDetailKey][indx][0];
                let explain = coinData[keyDate][selectedDetailKey][indx][1]; 
                let fullName = coinData[keyDate][selectedDetailKey][indx][2]; 
                listData.push({date: keyDate, url: url, explain: explain, fullName: fullName});
              }
            } 
          }

        return (
          <Modal 
              title={ listData[0]['fullName'] + ' (' + selectedDetailKey + ')' }
              visible={isModalVisible} 
              onOk={handleOk}
              onCancel={handleCancel}
              footer={[
              <Button key="submit" type="primary" onClick={() => setIsModalDetailVisible(false)}>
                BACK
              </Button>,
              ]}>
            <ul className="modal" style={{overflow: 'auto', maxHeight: '10rem'}}>
              {listData.map(item => (
                <li key={item.url} style={{marginBottom: '0.2rem'}}>
                  <a className="modal-content" href={item.url} target="_blank">{item.date + " " + item.explain}</a>
                </li>
              ))}
            </ul>
          </Modal>
        )
      } else {
          let listData = [];
          for (var key in coinData[selectedKey]) {
            listData.push({content: key});
          }
          return (
            <Modal 
                title={selectedKey}
                visible={isModalVisible} 
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                <Button key="submit" type="primary" onClick={handleOk}>
                  OK
                </Button>,
                ]}>
              <ul className="modal" style={{overflow: 'auto', maxHeight: '10rem'}}>
                {listData.map(item => (
                  <li key={item.content} style={{marginBottom: '0.2rem'}}>
                    <a className="modal-content" onClick={() => {setSelectedDetailKey(item.content); setIsModalDetailVisible(true);}}>{item.content}</a>
                  </li>
                ))}
              </ul>
            </Modal>
          )
      }
    }

    
    return (
      <div className='container'>
        {modal()}
        <span>COHO</span>
          <Calendar 
            className="calendar" 
            dateCellRender={(value) => dateCellRender(value)} 
            monthCellRender={monthCellRender} 
            onSelect={(value) => onClickCalendar(value)} />
      </div>
    )
    
    
}

export default LandingPage
