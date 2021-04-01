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

def multi_run_wrapper(args):
    do_process_with_thread_crawl(*args)

def do_process_with_thread_crawl(result):
    do_thread_crawl(coinmarketcal.get_urls(), coinscalendar.get_urls(), result)

def do_thread_crawl(urls1: list, urls2, result: dict):
    thread_list = []

    with ThreadPoolExecutor(max_workers=16) as executor:
        for url in urls2:
            thread_list.append(executor.submit(coinscalendar.do_crawl, (url, result)))
        for url in urls1:
            thread_list.append(executor.submit(coinmarketcal.do_crawl, (url, result)))
        for execution in concurrent.futures.as_completed(thread_list):
            execution.result()


if __name__ == '__main__':
    start_time = time.time()
    manager = multiprocessing.Manager()
    result = manager.dict()

    proc = multiprocessing.Process(target=do_thread_crawl, args=(coinmarketcal.get_urls(), coinscalendar.get_urls(), result))
    proc.start()
    proc.join()
    print(time.time() - start_time)
    # print(json.dumps(preprocessingDict(result.copy()), indent="\t"))
    for t, l in preprocessingDict(result.copy()).items():
        BlogData(title=t, link=l).save()
