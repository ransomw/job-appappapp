from gevent import monkey
# monkey.patch_socket()
monkey.patch_all()
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
from bs4.element import Tag
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection
from bson.objectid import ObjectId
import click
import flask
import werkzeug
import requests
import gevent
import aiohttp
import asyncio

MONGO_HOST = 'localhost'
MONGO_PORT = 27027

chrome_options = webdriver.ChromeOptions() 
chrome_options.add_argument("--remote-debugging-port=9222")

BASE_URL = "http://docs.python.org/3/library/"


def outer_list_item_to_modules(outer_list_item):
    modules = []
    inner_list = outer_list_item.ul
    if inner_list is None:
        return modules
    inner_list_items = [c for c in inner_list.children if isinstance(c, Tag)]
    for inner_list_item in inner_list_items:
        a = inner_list_item.a
        a_contents = a.contents
        if len(a_contents) < 2:
            continue
        code_tag = a_contents[0]
        text_description = a_contents[1]
        if (code_tag.name == 'code'
             and text_description[:3] == ' — '):
            module_name = code_tag.span.text
            description = ''.join([t.text for t in a_contents[1:]])[3:]
            modules.append({
                "link": a['href'],
                "module_name": module_name,
                "description": description,
            })
    return modules


def index_soup_to_modules(soup):
    page_section = soup.find('section', id="the-python-standard-library")
    toc_wrapper_div = page_section.find('div', class_="toctree-wrapper")
    outer_list = toc_wrapper_div.ul
    outer_list_items = [c for c in outer_list.children if isinstance(c, Tag)]
    modules = []
    for outer_list_item in outer_list_items:
        modules += outer_list_item_to_modules(outer_list_item)
    return modules


def scrape_modules():
    driver = webdriver.Chrome(service=Service("/home/ransom/sbin/chromedriver"), 
                            chrome_options=chrome_options)
    driver.get(BASE_URL+"index.html")
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    return index_soup_to_modules(soup)


def _parse_detail_page_text_to_str(page_text):
    soup = BeautifulSoup(page_text, 'html.parser')
    hr_el = soup.find('hr', class_="docutils")
    if hr_el is None:
        return None
    p_el = hr_el.next_sibling.next_sibling
    if p_el.name != 'p':
        return None
    return p_el.text


def scrape_detail(link, verbose=False):
    if verbose:
        print("scraping "+link)
    res = requests.get(BASE_URL+link)
    return _parse_detail_page_text_to_str(res.text)


async def scrape_detail_aio(link, verbose=False):
    async with aiohttp.ClientSession() as session:
        if verbose:
            print("scraping "+link)
        async with session.get(BASE_URL+link) as resp:
            page_text = await resp.text()
            if verbose:
                print("downloaded page at "+link)
    return _parse_detail_page_text_to_str(page_text)


async def scrape_details_aio(links, verbose=False):
    coros = [scrape_detail_aio(link, verbose=verbose) for link in links]
    details = await asyncio.gather(*coros)
    return details

def _get_db() -> Collection:
    mclient = MongoClient(MONGO_HOST, MONGO_PORT)
    mdb: Database = mclient.wd_scrape
    mcoll: Collection = mdb.python_stdlib
    return mcoll


modules_blueprint = flask.Blueprint('modules', __name__)

@modules_blueprint.route('/')
def list_modules():
    db = _get_db()
    modules = db.find()
    return flask.render_template("list.html", 
                                 modules=modules, 
                                 BASE_URL=BASE_URL)

@modules_blueprint.route('/module/<string:module_id>')
def module_detail(module_id):
    db = _get_db()
    module = db.find_one({"_id": ObjectId(module_id)})
    if 'detail' not in module:
        module['detail'] = "No details scraped"
    return flask.render_template("detail.html", 
                                 module=module, 
                                 BASE_URL=BASE_URL)

def build_flask_app():
    app = flask.Flask(__name__,
                      template_folder="templates_python_stdlib",
                      static_folder="static_python_stdlib")
    app.register_blueprint(modules_blueprint)
    return app


@click.group()
def cli():
    pass

@cli.command()
def populate_db():
    modules = scrape_modules()
    mcoll = _get_db()
    for module in modules:
        res = mcoll.find_one({"module_name": module['module_name']})
        if res is None:
            mcoll.insert_one(module)

@cli.command()
@click.option("--parallel", type=click.Choice(['none', 'gevent', 'aio']), default='none')
def add_db_details(parallel):
    mcoll = _get_db()
    qres = mcoll.find({"detail": {"$exists": False}})
    start = time.time()
    if parallel == 'none':
        for db_item in qres:
            print("scraping "+db_item["module_name"])
            detail = scrape_detail(db_item['link'])
            if detail is None:
                continue
            mcoll.update_one({"_id": db_item["_id"]},
                            {"$set": {"detail": detail}})
    elif parallel == 'gevent':
        qres_list = list(qres)
        detail_glets = [gevent.spawn(scrape_detail, db_item['link'], verbose=True) 
                        for db_item in qres_list]
        gevent.joinall(detail_glets)
        for db_item, glet in zip(qres_list, detail_glets):
            if glet.value is None:
                continue
            mcoll.update_one({"_id": db_item["_id"]},
                            {"$set": {"detail": glet.value}})
    elif parallel == 'aio':
        qres_list = list(qres)
        links = [db_item['link'] for db_item in qres_list]
        details = asyncio.run(scrape_details_aio(links, verbose=True))
        for db_item, detail in zip(qres_list, details):
            if detail is None:
                continue
            mcoll.update_one({"_id": db_item["_id"]},
                            {"$set": {"detail": detail}})            
    print("total time {:.2f}".format(time.time() - start))

@cli.command()
def run_app():
    app = build_flask_app()
    werkzeug.serving.run_simple(
        "0.0.0.0",
        5000,
        app,
        use_debugger=True,
    )

if __name__ == "__main__":
    cli()
