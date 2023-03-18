from warnings import warn
import time
from urllib.parse import urlparse
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from bs4 import BeautifulSoup
import requests
import click
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask import Flask, Blueprint, render_template
import werkzeug


MONGO_HOST = 'localhost'
MONGO_PORT = 27027

#

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
    if get_jobid_res.status_code != 200:
        breakpoint()
        return None
    soup = BeautifulSoup(get_jobid_res.text, 'html.parser')
    qres = soup.find_all('div', class_="pagebox")
    if len(qres) < 2:
        breakpoint()
        return None
    desc_div_el = qres[1]
    desc = desc_div_el.text
    return desc


def _get_db():
    client = MongoClient(MONGO_HOST, MONGO_PORT)
    db = client.wd_scrape
    return db.venture_loop


jobs_blueprint = Blueprint('jobs', __name__)

@jobs_blueprint.route("/")
def jobs_list():
    mcoll = _get_db()
    jobs = mcoll.find()
    return render_template("list.html", jobs=jobs)


@jobs_blueprint.route('/jobs/<string:job_id>')
def job_detail(job_id):
    mcoll = _get_db()
    job = mcoll.find_one({"_id": ObjectId(job_id)})
    if 'description' not in job:
        job['description'] = "no description scraped"
    return render_template("detail.html", job=job)


def build_app():
    app = Flask(__name__,
                template_folder="templates_venture_loop",
                static_folder="static_venture_loop")
    app.register_blueprint(jobs_blueprint)
    return app


@click.group()
def cli():
    pass

@cli.command()
@click.option("--search-term", required=True)
def populate_db(search_term):
    jobs = scrape_jobs(search_term)
    mcoll = _get_db()
    for job in jobs:
        res = mcoll.find_one({"jobid": job['jobid']})
        if res is None:
            job['search_term'] = search_term
            mcoll.insert_one(job)

@cli.command()
@click.option("--verbose", is_flag=True)
def add_db_details(verbose):
    mcoll = _get_db()
    qres = mcoll.find({"description": {"$exists": False}})
    qres_list = list(qres)
    for idx, db_item in enumerate(qres_list):
        if verbose:
            print(f"scraping {db_item['job_title']} ({idx}/{len(qres_list)})")
        desc = get_job_description(db_item['jobid'])
        if desc is None:
            warn(f"couldn't find job description {db_item['jobid']}")
        mcoll.update_one({"_id": db_item["_id"]},
                         {"$set": {"description": desc}})

@cli.command()
@click.option("--port", default=5000)
def run_app(port):
    app = build_app()
    werkzeug.serving.run_simple('0.0.0.0', port, app,
                                use_reloader=True, use_debugger=True)

if __name__ == '__main__':
    cli()
