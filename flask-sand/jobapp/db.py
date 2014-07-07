from sqlalchemy.orm.exc import NoResultFound

from database import db_session

from models import Company

def create_company(params):
    raise NotImplementedError("create_company not implemented")

def get_companies():
    return [
        {'name': "name"},
        {'name': "list"},
        {'name': "unimplemented"},
        ]
