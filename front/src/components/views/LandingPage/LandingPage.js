import React, { useState, useEffect } from 'react';
import { Calendar, Select, Button, Modal, Typography, Row, Col } from 'antd';
import './LandingPage.css'

const axios = require('axios');
const { Option } = Select;

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function LandingPage() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [coinData, setcoinData] = useState({});
    const [selectedKey, setSelectedKey] = useState("");
    const [isModalDetailVisible, setIsModalDetailVisible] = useState(false);
    const [selectedDetailKey, setSelectedDetailKey] = useState("");
    const [upbitCoin, setUpbitCoin] = useState([]);

    useEffect(() => {
      axios.get('/api/getCoinData')
        .then((response) => {
          setcoinData(JSON.parse(response.data[0].content));
        })
        .catch((err) => {
          console.log(err);
        });
      axios.get('https://api.upbit.com/v1/market/all?isDetails=false', {method: 'GET', headers: {Accept: 'application/json'}})
        .then((response) => {
          setUpbitCoin(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, [])

    function dateCellRender(value) {
      let tmpKey = value.year() + '-' + String(Number(value.month())+1) + '-' + value.date();
      // console.log(coinData[tmpKey]);
      //console.log(upbitCoin);
      let listData = [];
      for (var key in coinData[tmpKey]) {
        for (var indx in upbitCoin) {
          if (upbitCoin[indx].market.split('-')[1] == key) {
            listData.push({coinSymbol: key, coinKoreanName: upbitCoin[indx].korean_name});
            //console.log(upbitCoin[indx].market.split('-')[1], key);
            break;
          }
        }
      }

      return (
        <ul className="events">
          {listData.map(item => (
            <li key={uuidv4()}>
              <span style={{fontSize: '0.6rem'}}>{item.coinSymbol}</span>
            </li>
          ))}
        </ul>
      );
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
        let coinKoreanName = "";
        for (var indx in upbitCoin) {
          if (upbitCoin[indx].market.split('-')[1] == selectedDetailKey) {
            coinKoreanName = upbitCoin[indx].korean_name;
            break;
          }
        }
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
              title={ coinKoreanName + " " + listData[0]['fullName'] + ' (' + selectedDetailKey + ')' }
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
            for (var indx in upbitCoin) {
              if (upbitCoin[indx].market.split('-')[1] == key) {
                listData.push({coinSymbol: key, coinKoreanName: upbitCoin[indx].korean_name});
                //console.log(upbitCoin[indx].market.split('-')[1], key);
                break;
              }
            }
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
                  <li key={uuidv4()} style={{marginBottom: '0.2rem'}}>
                    <a className="modal-content" onClick={() => {setSelectedDetailKey(item.coinSymbol); setIsModalDetailVisible(true);}}>{item.coinKoreanName +  ' (' + item.coinSymbol + ')'}</a>
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
            onSelect={(value) => onClickCalendar(value)} 
            headerRender={({ value, type, onChange, onTypeChange }) => {
              const start = 0;
              const end = 12;
              const monthOptions = [];
      
              const current = value.clone();
              const localeData = value.localeData();
              const months = [];
              for (let i = 0; i < 12; i++) {
                current.month(i);
                months.push(localeData.monthsShort(current));
              }
      
              for (let index = start; index < end; index++) {
                monthOptions.push(
                  <Select.Option className="month-item" key={`${index}`}>
                    {months[index]}
                  </Select.Option>,
                );
              }
              const month = value.month();

              return (
                <div style={{ padding: 8 }}>
                  <Row gutter={8}>
                    <Col>
                      <Select
                        size="small"
                        dropdownMatchSelectWidth={false}
                        value={String(month)}
                        onChange={selectedMonth => {
                          const newValue = value.clone();
                          newValue.month(parseInt(selectedMonth, 10));
                          onChange(newValue);
                        }}
                      >
                        {monthOptions}
                      </Select>
                    </Col>
                    <Col>
                      <Select
                        size="small"
                        dropdownMatchSelectWidth={false}
                        value={"Upbit"}>
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                      </Select>
                  </Col>
                  </Row>
                </div>
              );
            }}
            />
      </div>
    )
    
    
}

export default LandingPage
