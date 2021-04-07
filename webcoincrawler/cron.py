import json
import collections

import crawl_coinmarketcal as coinmarketcal
import crawl_coinscalendar as coinscalendar
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
import django
import datetime

django.setup()
from crawled_data.models import BlogData


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

    urls = coinscalendar.get_urls()
    for url in urls:
        coinscalendar.do_crawl(url, result)

    BlogData(title="COIN_DATA", content=json.dumps(preprocessingDict(result.copy()))).save()
def crontab_test():
    urls = coinmarketcal.get_urls()

    test_dict = {'2021-4-10': {
        'XXX': [['https://coinmarketcal.com/en/event/dis-listing-on-pancake-64795', str(datetime.datetime.now()),
                 str(datetime.datetime.now())]]
    },
        '2021-4-12': {
            'YYY': [['https://coinmarketcal.com/en/event/alpha-release-63956', str(datetime.datetime.now()),
                     str(datetime.datetime.now())]]
        },
    }

    BlogData(title="COIN_DATA", content=json.dumps(test_dict)).save()