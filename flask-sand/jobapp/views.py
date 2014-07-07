from pdb import set_trace as st

from flask import url_for
from flask import render_template
from flask import request
from flask import flash

from werkzeug.datastructures import ImmutableDict

from jobapp import app

import db
from db import DbException

class HttpMethods(object):
    GET = 'GET'
    POST = 'POST'

@app.route('/hey', methods=[HttpMethods.GET, HttpMethods.POST])
def hey():
    NAME_KEY = 'name'
    if request.method == HttpMethods.POST:
        if NAME_KEY in request.form.keys():
            return ''.join(['Hey ',
                            request.form[NAME_KEY],
                            '.',
                            ])
        else:
            return "Hey, what's your name?"
    return 'Hey, no POST.'


_url_company_create = '/companies/new'
@app.route(_url_company_create, methods=['GET', 'POST'])
def company_create():
    NAME_KEY = 'name'
    if request.method == 'POST':
        try:
            db.create_company(ImmutableDict(
                    name = request.form[NAME_KEY]))
            flash("company created")
        except DbException as e:
            flash("Error creating company: '" + e.msg + "'")
        except Exception as e:
            print "*************************************"
            print "unexpected error creating new company"
            print e
            print repr(e)
            st()
            print "*************************************"
            flash("unexpected error creating new company")
    return render_template('new_company.html', url_self=_url_company_create)


@app.route('/companies')
def company_list():
    return render_template('company_list.html',
                           companies=db.get_companies())
