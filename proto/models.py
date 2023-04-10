import os
import enum
import datetime
from sqlalchemy import create_engine
from sqlalchemy import MetaData
from sqlalchemy import Table, Column
from sqlalchemy import Integer, String, Text, Enum, ForeignKey, DateTime
from sqlalchemy import Engine, Connection, CursorResult
from sqlalchemy import select, insert, update
from sqlalchemy.engine.row import Row
from flask import g
from werkzeug.local import LocalProxy

SA_DB_URI = os.environ.get('PROTO_DATABASE', "sqlite:///" + "proto.db")

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
    Column("status", Enum(Status)),
)

status_history_table = Table(
    "status_history",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("job_id", Integer,
           ForeignKey(job_table.c.id, ondelete='CASCADE'),
           nullable=False,
           ),
    Column("status", Enum(Status)),
    Column("datetime", DateTime, default=datetime.datetime.utcnow),
)

contact_table = Table(
    "contact",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("name", String(100)),
    Column("company", String),
    Column("email", String(120)),
    Column("phone", String(30)),
    Column("notes", Text),
    Column("intro_id", Integer, ForeignKey('contact.id')),
)

# https://flask.palletsprojects.com/en/2.2.x/appcontext/#storing-data
def get_engine() -> Engine:
    return create_engine(SA_DB_URI, echo=False)


def connect_db() -> Connection:
    engine = get_engine()
    # The sole purpose of the Engine object from a user-facing perspective 
    # is to provide a unit of connectivity to the database called the Connection.
    conn: Connection = engine.connect()
    return conn


def get_db():
    if 'db' not in g:
        g.db = connect_db()
    return g.db

# db = LocalProxy(get_db)

###

def get_contact_by_id(conn, contact_id):
    contact_alias_1 = contact_table.alias()
    sel_stmt = select(contact_table, 
                      contact_alias_1.c.id, contact_alias_1.c.name).outerjoin(
                        contact_alias_1,
                        contact_alias_1.c.id == contact_table.c.intro_id
                      ).where(contact_table.c.id == contact_id)
    res: CursorResult = conn.execute(sel_stmt)
    row: Row = res.fetchone()
    return row._asdict()


def list_contacts(conn):
    contact_alias_1 = contact_table.alias()
    sel_stmt = select(contact_table, 
                  contact_alias_1.c.id, contact_alias_1.c.name).outerjoin(
    contact_alias_1,
    contact_alias_1.c.id == contact_table.c.intro_id)
    res = conn.execute(sel_stmt)
    rows = res.mappings().all()
    return rows


def add_contact(conn, form_info):
    stmt_contact = insert(contact_table).values(
        name=form_info['name'],
        company=form_info['company'],
        email=form_info['email'],
        phone=form_info['phone'],
        notes=form_info['notes'],
        intro_id=(None if form_info['intro_id'] == 'none' else int(form_info['intro_id']))
    )
    conn.execute(stmt_contact)
    conn.commit()


def update_contact(conn, contact_id, form_info):
    stmt = update(contact_table).where(
        contact_table.c.id == contact_id
    ).values(
        name=form_info['name'],
        company=form_info['company'],
        email=form_info['email'],
        phone=form_info['phone'],
        notes=form_info['notes'],
        intro_id=(None if form_info['intro_id'] == 'none' else int(form_info['intro_id']))
    )
    conn.execute(stmt)
    conn.commit()


def list_jobs(conn):
    sel_stmt = select(job_table)
    res = conn.execute(sel_stmt)
    rows = res.mappings().all()
    return rows


def add_job(conn, form_info):
    stmt_job = insert(job_table).values(
        title=form_info['title'],
        company=form_info['company'],
        description=form_info['description'],
        status=Status.new,
    ).returning(job_table.c.id)
    res_job = conn.execute(stmt_job).fetchone()
    stmt_status = insert(status_history_table).values(
        job_id=res_job.id,
        status=Status.new,
        datetime=datetime.datetime.utcnow(),
    )
    conn.execute(stmt_status)
    conn.commit()


def get_job_by_id(conn, job_id):
    sel_stmt = select(job_table).where(job_table.c.id == job_id)
    res: CursorResult = conn.execute(sel_stmt)
    row: Row = res.fetchone()
    return row._asdict()


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

def set_job_status(conn, job_id, status):
    stmt = update(job_table).where(
        job_table.c.id == job_id
    ).values(
        status=status,
    )
    conn.execute(stmt)
    conn.commit()
