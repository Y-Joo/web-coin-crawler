from selenium import webdriver 
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json

def do_crawl():
    options = webdriver.ChromeOptions()
    options.add_experimental_option('excludeSwitches', ['enable-logging'])

    driver = webdriver.Chrome(options=options, executable_path="./chromedriver")
    driver.implicitly_wait(3)
    driver.get("https://wisebody.co.kr/coinone")
    crawl_data = driver.find_elements_by_class_name('coinName')

    result = { }
    for item in crawl_data:
        coin_data = str(item.text)
        coin_data = " ".join(coin_data.split())
        coin_data = coin_data.split(' ')
        if(len(coin_data) == 2):
            result[coin_data[0]] = coin_data[1]
        else:
            result[coin_data[0]] = ""
    with open('coinone.json', 'w', encoding='utf-8') as make_file:
        json.dump(result, make_file, indent="\t")

def read_json():
    with open('coinone.json', 'r') as f:
        json_data = json.load(f)
        print("coinone read_json 완료")
        return json_data
# do_crawl()
# read_json()