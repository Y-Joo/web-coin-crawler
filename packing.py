import json
import os
import sys
from urllib.request import urlopen
from bs4 import BeautifulSoup
import multiprocessing
import time
import re

month = {'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11,
         'Dec': 12}


def getPageNumberFromcoinmarketcal():
    html = urlopen("https://coinmarketcal.com/en/")
    soup = BeautifulSoup(html, "html.parser")
    coin_maxpage_data = soup.select("a[class='page-link rounded']").pop()
    coin_maxpage = re.findall("\d+", str(coin_maxpage_data))
    return int(coin_maxpage.pop())


def packingDataFromcoinmarketcal(page_number, result):
    proc = os.getpid()
    url = "https://coinmarketcal.com/en/" + "?page=" + str(page_number)
    html = urlopen(url)

    # # 사이트에 문제가 있으면 함수 종료
    # if html.status != 200:
    #     return
    soup = BeautifulSoup(html, "html.parser")

    # 정보 -> 이름, 호재 시간, 추가된 시간, 제목, 상세내용
    coin_key_data = soup.select("article.col-xl-3.col-lg-4.col-md-6.py-3 > div.card.text-center > div.card__body > a.link-detail")
    coin_name_data = soup.select("article.col-xl-3.col-lg-4.col-md-6.py-3 > div.card.text-center > div.card__body > h5.card__coins > a.link-detail")
    coin_goodnewstime_data = soup.select("h5[class = 'card__date mt-0']")
    coin_addedtime_data = soup.select("p[class = 'added-date']")
    coin_title_data = soup.select("article.col-xl-3.col-lg-4.col-md-6.py-3 > div.card.text-center > div.card__body > a.link-detail > h5.card__title.mb-0.ellipsis")
    coin_detail_data = soup.select("p[class = 'card__description']")

    min_len = min(len(coin_name_data), len(coin_goodnewstime_data), len(coin_addedtime_data), len(coin_title_data),
                  len(coin_detail_data))

    # 전처리 이름[이름, 태그], 호재 시간[년, 월, 일], 추가된 시간[년, 월, 일], 제목[문자열], 상세내용[문자열]
    # 전처리 후 패킹
    for i in range(0, min_len):
        #딕셔너리 키 값
        coin_key = str(coin_key_data[i])
        coin_key = coin_key[coin_key.find('href="') + 6 : coin_key.find('" title')]
        # 이름 전처리
        coin_name = ' '.join(coin_name_data[i].string.split())
        coin_name = [coin_name[0: coin_name.find('(') - 1], coin_name[coin_name.find('(') + 1: coin_name.find(')')]]
        # 호재 시간
        coin_goodnewstime = coin_goodnewstime_data[i].string.split()
        coin_goodnewstime = coin_goodnewstime[:3]
        coin_goodnewstime[1] = str(month[coin_goodnewstime[1]])
        coin_goodnewstime.reverse()
        # 추가된 시간
        coin_addedtime = coin_addedtime_data[i].string.split()
        coin_addedtime = coin_addedtime[1:]
        coin_addedtime[1] = str(month[coin_addedtime[1]])
        coin_addedtime.reverse()
        # 제목
        coin_title = str(coin_title_data[i].string)
        # 상세내용
        coin_detail = ' '.join(coin_detail_data[i].string.split())
        coin_detail = coin_detail[0 : len(coin_detail) - 1]

        # 패킹
        item_coin = {
            'name': coin_name,
            'goodnewstime': coin_goodnewstime,
            'addedtime': coin_addedtime,
            'title': coin_title,
            'detail': coin_detail
        }
        result[coin_key] = item_coin


if __name__ == '__main__':
    start_time = time.time()
    manager = multiprocessing.Manager()
    result = manager.dict()
    indxs = [i for i in range(1, getPageNumberFromcoinmarketcal() + 1)]
    procs = []

    for i, v in enumerate(indxs):
        proc = multiprocessing.Process(target=packingDataFromcoinmarketcal, args=(v, result))
        procs.append(proc)
        proc.start()

    for proc in procs:
        proc.join()

    print(time.time() - start_time)
    print(json.dumps(result.copy(), indent="\t"))

