from pdb import set_trace as st

from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.exc import IntegrityError

from database import db_session

from models import Company

# todo: logging
class DbException(Exception):
    def __init__(self, msg, cause=None):
        self.cause = cause
        self.msg = msg
        # super(self).__init__(msg)

def create_company(params):
    db_session.add(Company(params['name']))
    try:
        db_session.commit()
    except IntegrityError as e:
        db_session.rollback()
        raise DbException("duplicate name parameter", e)

def get_companies():
    company_query = db_session.query(Company)
    return [ company for company in company_query ]

