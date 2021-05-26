from urllib.request import urlopen
from bs4 import BeautifulSoup
import re

month = {'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11,
         'Dec': 12}

def get_urls():
    html = urlopen("https://coinmarketcal.com/en/")
    soup = BeautifulSoup(html, "html.parser")
    coin_maxpage_data = soup.select("a[class='page-link rounded']").pop()
    coin_maxpage = re.findall("\d+", str(coin_maxpage_data))
    urls = []
    for i in range(1, int(coin_maxpage.pop())):
        urls.append("https://coinmarketcal.com/en/" + "?page=" + str(i))
    return urls

def do_crawl(url, result):
    html = urlopen(url)

    # # 사이트에 문제가 있으면 함수 종료
    if html.status != 200:
        return
    soup = BeautifulSoup(html, "html.parser")

    # 정보 -> 이름, 호재 시간, 추가된 시간, 제목, 상세내용
    coin_link_data = soup.select("article.col-xl-3.col-lg-4.col-md-6.py-3 > div.card.text-center > div.card__body > a.link-detail")
    coin_name_data = soup.select("article.col-xl-3.col-lg-4.col-md-6.py-3 > div.card.text-center > div.card__body > h5.card__coins > a.link-detail")
    coin_date_data = soup.select("h5[class = 'card__date mt-0']")
    coin_title_data = soup.select("article.col-xl-3.col-lg-4.col-md-6.py-3 > div.card.text-center > div.card__body > a.link-detail > h5.card__title.mb-0.ellipsis")

    min_len = min(len(coin_name_data), len(coin_date_data), len(coin_title_data),)

    # 전처리 이름[이름, 태그], 호재 시간[년, 월, 일], 추가된 시간[년, 월, 일], 제목[문자열], 상세내용[문자열]
    # 전처리 후 패킹
    for i in range(0, min_len):
        # 링크 전처리
        coin_link = str(coin_link_data[i])
        coin_link = coin_link[coin_link.find('href="') + 6 : coin_link.find('" title')]
        coin_link = "https://coinmarketcal.com" + coin_link
        # 이름 전처리
        coin_name = ' '.join(coin_name_data[i].string.split())
        coin_name = [coin_name[0: coin_name.find('(') - 1], coin_name[coin_name.find('(') + 1: coin_name.find(')')]]
        # 호재 시간
        coin_date = coin_date_data[i].string.split()
        coin_date = coin_date[:3]
        coin_date[1] = str(month[coin_date[1]])
        coin_date.reverse()
        coin_date = coin_date[0] + "/" + coin_date[1] + "/" + (coin_date[2] if coin_date[2][0] != '0' else coin_date[2][1])
        # 제목
        coin_title = str(coin_title_data[i].string)
        # 패킹
        item_coin = {
            'symbol': coin_name[1],
            'name' : coin_name[0],
            'date' : coin_date,
            'title': coin_title,
        }
        print(item_coin)
        result[coin_link] = item_coin