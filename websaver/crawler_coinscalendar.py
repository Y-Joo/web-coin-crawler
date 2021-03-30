from urllib.request import urlopen
from bs4 import BeautifulSoup
import collections
import re

month = {'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11,
         'Dec': 12}

def getPageNumberFromcoinscalendar():
    html = urlopen("https://coinscalendar.com/")
    soup = BeautifulSoup(html, "html.parser")
    coin_maxpage_data = soup.select("a[class='page-link']").pop()
    coin_maxpage = str(coin_maxpage_data)
    coin_maxpage = coin_maxpage[coin_maxpage.find("page/") + 5 : coin_maxpage.find('">')]
    return int(coin_maxpage)

def packingDataFromcoinscalendar(page_number, result):
    url = "https://coinscalendar.com/" + "page/" + str(page_number)
    html = urlopen(url)

    # # 사이트에 문제가 있으면 함수 종료
    if html.status != 200:
        return
    soup = BeautifulSoup(html, "html.parser")

    # 정보 -> 이름, 호재 시간, 추가된 시간, 제목, 상세내용
    coin_link_data = soup.select("a[class='event-name']")
    coin_name_data = soup.select("a[class='coin-name']")
    coin_date_data = soup.select("div[class='coin-date']")
    coin_title_data = soup.select("a[class='event-name']")

    min_len = min(len(coin_name_data), len(coin_date_data), len(coin_title_data), len(coin_link_data))
    # print(coin_link_data)
    # print(coin_name_data)
    # print(coin_date_data)
    # print(coin_title_data)
    # 전처리 이름[이름, 태그], 호재 시간[년, 월, 일], 추가된 시간[년, 월, 일], 제목[문자열], 상세내용[문자열]
    # 전처리 후 패킹
    for i in range(0, min_len):
        # 링크 전처리
        coin_link = str(coin_link_data[i])
        coin_link = coin_link[coin_link.find('href="') + 6 : coin_link.find('">')]
        coin_link = "https://coinscalendar.com" + coin_link
        # 이름 전처리
        coin_name = str(coin_name_data[i])
        coin_symbol = coin_name[coin_name.find('(') + 1 : coin_name.find(')')]
        coin_name = coin_name[coin_name.find('">') + 2: coin_name.find("<small>")-1]
        # 호재 시간
        coin_date = coin_date_data[i].string.split()
        coin_date = coin_date[:3]
        coin_date[1] = str(month[coin_date[1]])
        coin_date.reverse()
        coin_date = coin_date[0] + "-" + coin_date[1] + "-" + coin_date[2]
        # 제목
        coin_title = str(coin_title_data[i].string)
        # 패킹
        item_coin = {
            'symbol': coin_symbol,
            'name' : coin_name,
            'date' : coin_date,
            'title': coin_title,
        }
        print(item_coin)
        result[coin_link] = item_coin
