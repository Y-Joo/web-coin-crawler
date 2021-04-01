import concurrent
import json
import collections
import multiprocessing
import time
from concurrent.futures.thread import ThreadPoolExecutor

import crawl_coinmarketcal as coinmarketcal
import crawl_coinscalendar as coinscalendar
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "websaver.settings")
import django
django.setup()
from parsed_data.models import BlogData
global result
def preprocessingDict(dic: dict):
    coin_dict = collections.defaultdict(dict)
    for key, value in dic.items():
        if value['symbol'] in coin_dict[value['date']]:
            coin_dict[value['date']][value['symbol']].append([key, value['title'], value['name']])
        else:
            coin_dict[value['date']][value['symbol']] = [[key, value['title'], value['name']]]
    return coin_dict

if __name__ == '__main__':
    start_time = time.time()
    manager = multiprocessing.Manager()
    result = manager.dict()
    procs = []
    urls = []

    urls = coinmarketcal.get_urls()
    for url in urls:
        proc = multiprocessing.Process(target=coinmarketcal.do_crawl, args=(url, result,))
        procs.append(proc)
        proc.start()

    urls = coinscalendar.get_urls()
    for url in urls:
        proc = multiprocessing.Process(target=coinscalendar.do_crawl, args=(url, result,))
        procs.append(proc)
        proc.start()

    for proc in procs:
        proc.join()

    print(time.time() - start_time)
    BlogData(title="COIN_DATA", link=preprocessingDict(result.copy())).save()
