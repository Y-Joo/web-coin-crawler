import json
import collections
import os
import sys
import django
import crawl_coinmarketcal as coinmarketcal
import crawl_bitsum as bitsum
import api_upbit as upbit
import crawl_coinone as coinone
import crawl_coinbit as coinbit

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()
# from models import CoinData
from data.models import CoinData

def preprocessingDict(dic: dict):
    coin_dict = collections.defaultdict(dict)
    for key, value in dic.items():
        if value['symbol'] in coin_dict[value['date']]:
            coin_dict[value['date']][value['symbol']].append([key, value['title'], value['name']])
        else:
            coin_dict[value['date']][value['symbol']] = [[key, value['title'], value['name']]]
    return coin_dict


def crontab():
    result = dict()

    urls = coinmarketcal.get_urls()
    for url in urls:
        coinmarketcal.do_crawl(url, result)
    
    result_coin_name = {}

    # 실시간으로 크롤링
    result_coin_name['bitsum'] = bitsum.do_crawl()
    result_coin_name['upbit'] = upbit.do_crawl()

    # 미리 돌려놓은 크롤링 json 파일 읽기
    result_coin_name['coinone'] = coinone.read_json()
    result_coin_name['coinbit'] = coinbit.read_json()

    CoinData.objects.filter(title="COIN_NAME").delete()
    CoinData(title="COIN_NAME", content=json.dumps(result_coin_name)).save()

    CoinData.objects.filter(title="COIN_DATA").delete()
    CoinData(title="COIN_DATA", content=json.dumps(preprocessingDict(result.copy()))).save()

crontab()
