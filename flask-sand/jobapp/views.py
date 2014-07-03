from flask import url_for
from flask import render_template

from jobapp import app

@app.route('/hello')
def hello():
    return 'Hello World.'

@app.route('/companies/new')
def create_company():
    return render_template('new_company.html')
