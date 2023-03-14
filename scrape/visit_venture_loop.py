from warnings import warn
import time
from urllib.parse import urlparse
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from bs4 import BeautifulSoup
import requests

NEXT_CLICK_LOAD_TIME = 6
BASE_URL = "https://www.ventureloop.com/ventureloop/"

chrome_options = webdriver.ChromeOptions() 
chrome_options.add_argument("--remote-debugging-port=9222")

def table_soup_to_jobs(table_soup):
    all_table_rows = table_soup.find('tbody').find_all('tr')
    table_head_row = all_table_rows[0]
    column_titles = [el.text for el in table_head_row.find_all('th')]
    column_titles_normalized = [s.lower().replace(' ', '_') for s in column_titles]
    table_rows = all_table_rows[1:]
    jobs = []
    for table_row in table_rows:
        column_texts_list = [el.text for el in table_row.find_all('td')]
        column_texts = dict(zip(column_titles_normalized, column_texts_list))
        link_str = table_row.find_all('td')[1].a['href']
        link_query_dict = dict([s.split('=') for s in urlparse(link_str).query.split('&')])
        jobid = link_query_dict["jobid"]
        column_texts['jobid'] = jobid
        jobs.append(column_texts)
    return jobs


def scrape_jobs(search_term):
    driver = webdriver.Chrome(service=Service("/home/ransom/sbin/chromedriver"), 
                            chrome_options=chrome_options)

    driver.implicitly_wait(7)

    driver.get(BASE_URL+"home.php")

    input_el = driver.find_element(By.ID, "keywords")
    input_el.click()
    input_el.send_keys(search_term)

    button_el = driver.find_element(By.CSS_SELECTOR, ".submitTd")
    button_el.click()

    jobs = []
    next_page_num = 2
    while True:
        table_el = driver.find_element(By.CSS_SELECTOR, "#news_tbl")
        table_soup = BeautifulSoup(table_el.get_attribute('outerHTML'), 'html.parser')
        curr_jobs = table_soup_to_jobs(table_soup)
        curr_jobids = set([job['jobid'] for job in curr_jobs])
        jobids = set([job['jobid'] for job in jobs])
        if jobids.intersection(curr_jobids):
            warn('duplicate job ids, consider incrementing timeout')
        jobs += curr_jobs
        try:
            next_button = driver.find_element(By.XPATH, (
                '//div[contains(@class, "headertba")]'
                '//a[@id={npn}]').format(npn=next_page_num))
        except NoSuchElementException:
            break
        next_button.click()
        next_page_num += 1
        time.sleep(NEXT_CLICK_LOAD_TIME)
    return jobs


def get_job_description(jobid):
    get_jobid_res = requests.get(BASE_URL+"/jobdetail.php?jobid="+jobid)
    soup = BeautifulSoup(get_jobid_res.text, 'html.parser')
    desc_div_el = soup.find_all('div', class_="pagebox")[1]
    desc = desc_div_el.text
    return desc

jobs = scrape_jobs("argo")

breakpoint()