import concurrent
import json
import os
import sys
from concurrent.futures.thread import ThreadPoolExecutor
from urllib.request import urlopen
from bs4 import BeautifulSoup
import multiprocessing
import time
import re
import requests

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


def do_html_crawl(url):
    print(url)
    html = urlopen(url)
    parsed_html = BeautifulSoup(html, "html.parser")
    coin_name_data = parsed_html.select(
        "article.col-xl-3.col-lg-4.col-md-6.py-3 > div.card.text-center > div.card__body > h5.card__coins > a.link-detail")
    print(coin_name_data[0])


def do_process_with_thread_crawl(urls):
    do_thread_crawl(get_urls())

def do_thread_crawl():
    urls = get_urls()
    thread_list = []
    with ThreadPoolExecutor(max_workers=8) as executor:
        for url in urls:
            thread_list.append(executor.submit(do_html_crawl, url))
        for execution in concurrent.futures.as_completed(thread_list):
            execution.result()

if __name__ == '__main__':
    start_time = time.time()
    manager = multiprocessing.Manager()
    result = manager.dict()
    urls = get_urls()
    # do_thread_crawl()
    # with multiprocessing.Pool(processes=8) as pool:
    #     pool.map(do_process_with_thread_crawl, urls)
    procs = []
    for url in urls:
        print(url)
        proc = multiprocessing.Process(target=do_html_crawl, args=(url,))
        procs.append(proc)
        proc.start()

    for proc in procs:
        proc.join()

    print(time.time() - start_time)