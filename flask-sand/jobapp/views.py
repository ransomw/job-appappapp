from flask import url_for
from flask import render_template
from flask import request
from flask import flash

from jobapp import app

import db

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
    if request.method == 'POST':
        try:
            db.create_company({})
            flash("create company unimplemented")
        except NotImplementedError:
            flash("create company unimplemented")
        except Exception:
            flash("unexpected error creating new company")
    return render_template('new_company.html', url_self=_url_company_create)


@app.route('/companies')
def company_list():
    return render_template('company_list.html',
                           companies=db.get_companies())
