from urllib.request import Request, urlopen
from bs4 import BeautifulSoup
import re

def do_crawl():
    req = Request('https://www.bithumb.com/trade/order/BTC_KRW', headers={'User-Agent': 'Mozilla/5.0'})
    html = urlopen(req).read()

    # # 사이트에 문제가 있으면 함수 종료
    # if html.status != 200:
    #     return
    soup = BeautifulSoup(html, "html.parser")

    # 정보 -> 이름, 호재 시간, 추가된 시간, 제목, 상세내용
    crawl_data = soup.select("span[class = 'coinSymbol sort_coin']")

    result = { }
    for item in crawl_data:
        coin_data = str(item)
        # print(coin_data)
        coin_korean = coin_data[coin_data.find('data-sorting=') + 14 : coin_data.find('>') - 1]
        coin_symbol = coin_data[coin_data.find('">') + 2 : coin_data.find('/')]
        result[coin_symbol] = coin_korean
    print(result)
    
    return result
do_crawl()