import enum
from sqlalchemy import create_engine
from sqlalchemy import MetaData
from sqlalchemy import Table, Column
from sqlalchemy import Integer, String, Text, Enum
from sqlalchemy import Engine, Connection, CursorResult
from sqlalchemy import select, insert, update
from flask import g
from werkzeug.local import LocalProxy

metadata_obj = MetaData()

class Status(enum.Enum):
    new = 1
    applied = 2
    init_int = 3
    tech_int = 4
    add_int = 5
    reject = 6
    offer = 7

job_table = Table(
    "job",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("title", String(100)),
    Column("company", String),
    Column("description", Text),
    Column("status", Enum(Status))
)

# https://flask.palletsprojects.com/en/2.2.x/appcontext/#storing-data
def get_engine() -> Engine:
    return create_engine("sqlite:///" + "proto.db", echo=False)


def connect_db() -> Connection:
    engine = get_engine()
    conn: Connection = engine.connect()
    return conn


def get_db():
    if 'db' not in g:
        g.db = connect_db()
    return g.db

# db = LocalProxy(get_db)

###

def list_jobs(conn):
    sel_stmt = select(job_table)
    res = conn.execute(sel_stmt)
    rows = res.mappings().all()
    return rows


def add_job(conn, form_info):
    stmt = insert(job_table).values(
        title=form_info['title'],
        company=form_info['company'],
        description=form_info['description'],
        status=Status.new,
    )
    conn.execute(stmt)
    conn.commit()


def get_job_by_id(conn, job_id):
    sel_stmt = select(job_table).where(job_table.c.id == job_id)
    res: CursorResult = conn.execute(sel_stmt)
    return res.fetchone()


def update_job(conn, job_id, form_info):
    stmt = update(job_table).where(
        job_table.c.id == job_id
    ).values(
        title=form_info['title'],
        company=form_info['company'],
        description=form_info['description'],        
    )
    conn.execute(stmt)
    conn.commit()

