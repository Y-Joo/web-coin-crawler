from urllib.request import Request, urlopen
from bs4 import BeautifulSoup

def do_crawl():
    html = urlopen('https://wisebody.co.kr/coinone')

    # # 사이트에 문제가 있으면 함수 종료
    # if html.status != 200:
    #     return
    soup = BeautifulSoup(html, "html.parser")

    # 정보 -> 이름, 호재 시간, 추가된 시간, 제목, 상세내용
    crawl_data = soup.select("table")
    print(soup)

do_crawl()