import json
import collections
import multiprocessing
import time
import crawler_coinmarketcal
import crawler_coinscalendar
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "websaver.settings")
import django
django.setup()
from parsed_data.models import BlogData

def preprocessingDict(dic : dict):
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

    for i in range(1, crawler_coinmarketcal.getPageNumberFromcoinmarketcal() + 1):
        proc = multiprocessing.Process(target=crawler_coinmarketcal.packingDataFromcoinmarketcal, args=(i, result))
        procs.append(proc)
        proc.start()

    for i in range(1, crawler_coinscalendar.getPageNumberFromcoinscalendar() + 1):
        proc = multiprocessing.Process(target=crawler_coinscalendar.packingDataFromcoinscalendar, args=(i, result))
        procs.append(proc)
        proc.start()

    for proc in procs:
        proc.join()

    print(time.time() - start_time)
    print(json.dumps(preprocessingDict(result.copy()), indent="\t"))
    # for t, l in result.items():
    #     BlogData(title=t, link=l).save()
