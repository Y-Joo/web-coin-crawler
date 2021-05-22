import json
import collections
import os
import sys
import django
import crawl_coinmarketcal as coinmarketcal

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

    # urls = coinscalendar.get_urls()
    # for url in urls:
    #     coinscalendar.do_crawl(url, result)
    CoinData.objects.all().delete()
    CoinData(title="COIN_DATA", content=json.dumps(preprocessingDict(result.copy()))).save()
crontab()