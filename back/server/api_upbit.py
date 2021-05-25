from urllib.request import Request, urlopen
from bs4 import BeautifulSoup
import re
import requests

def do_crawl():
    url = "https://api.upbit.com/v1/market/all"

    querystring = {"isDetails":"false"}

    headers = {"Accept": "application/json"}

    response = requests.request("GET", url, headers=headers, params=querystring).json()
    
    # print(response)
    result = { }
    for item in response:
        coin_data = item
        # print(coin_data)
        coin_korean = coin_data['korean_name']
        coin_symbol = coin_data['market'][coin_data['market'].find('-') + 1 : ]
        # print(coin_symbol)
        result[coin_symbol] = coin_korean
        # result.append({ 'coinKorean': coin_korean, 'coinSymbol': coin_symbol })
    print("upbit do_crawl 완료")
    
    return result