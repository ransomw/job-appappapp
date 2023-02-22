from flask import render_template
from flask import Blueprint
from flask import request
from flask import redirect, url_for

import models

crud_blueprint = Blueprint('crud', __name__)

@crud_blueprint.route('/')
def list_jobs():
    db_conn = models.get_db()
    jobs = models.list_jobs(db_conn)
    return render_template("list.html", jobs=jobs)


@crud_blueprint.route('/new', methods=['GET', 'POST'])
def add_new_job():
    if request.method == 'POST':
        db_conn = models.get_db()
        models.add_job(db_conn, request.form)
        return redirect(url_for('.list_jobs'))
    else:
        return render_template("add_new.html")


@crud_blueprint.route('/set-status/<int:job_id>')
def set_application_status(job_id):
    db_conn = models.get_db()
    job = models.get_job_by_id(db_conn, job_id)
    return render_template("set_status.html", job=job)



viz_blueprint = Blueprint('viz', __name__)

@viz_blueprint.route('/')
def viz_root():
    return "data viz unimplemented"
