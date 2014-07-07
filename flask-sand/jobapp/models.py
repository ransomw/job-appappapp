from pdb import set_trace as st

from sqlalchemy import Table
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapper
from sqlalchemy.orm import relationship

from werkzeug.datastructures import ImmutableDict

from database import metadata

_LEN_COMPANY_NAME = 100
_LEN_APP_STAT = 2

companies = Table(
    'companies', metadata,
    Column('id', Integer, primary_key=True),
    Column('name', String(_LEN_COMPANY_NAME), nullable=False, unique=True)
    )
openings = Table(
    'openings', metadata,
    Column('id', Integer, primary_key=True),
    # Column('name', String(_LEN_COMPANY_NAME), nullable=False, unique=True),
    Column('name', String(_LEN_COMPANY_NAME), unique=True),
    Column('status', String(_LEN_APP_STAT), nullable=False),
    Column('company_id', Integer, ForeignKey('companies.id'), nullable=False)
    )

class Company(object):
    def __init__(self, name):
        self.name = name

mapper(Company, companies)

class Opening(object):
    APP_STAT = ImmutableDict(
        NOT_APPLIED = "NA",
        APPLIED = "AP",
        REJECT_NO_INTERVIEW = "RN",
        INTERVIEWING = "IN",
        REJECT_INTERVIEW = "RI",
        ACCEPTED = "AC")
    def __init__(self, name, status):
        self.name = name
        self.status = status

mapper(Opening, openings, properties={
        'company': relationship(Company)
        })
