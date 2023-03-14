from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
from bs4.element import Tag
from pymongo import MongoClient
from pymongo.collection import Collection
from bson.objectid import ObjectId
import click
import flask
import werkzeug
import requests

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


def scrape_detail(link):
    res = requests.get(BASE_URL+link)
    soup = BeautifulSoup(res.text, 'html.parser')
    hr_el = soup.find('hr', class_="docutils")
    if hr_el is None:
        return None
    p_el = hr_el.next_sibling.next_sibling
    if p_el.name != 'p':
        return None
    return p_el.text


def _get_db() -> Collection:
    mclient = MongoClient('localhost', 27027)
    mdb = mclient.wd_scrape
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
def add_db_details():
    mcoll = _get_db()
    qres = mcoll.find({"detail": {"$exists": False}})
    for db_item in qres:
        print("scraping "+db_item["module_name"])
        detail = scrape_detail(db_item['link'])
        if detail is None:
            continue
        mcoll.update_one({"_id": db_item["_id"]},
                         {"$set": {"detail": detail}})

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
