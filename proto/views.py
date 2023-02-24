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


@crud_blueprint.route('/edit/<int:job_id>', methods=['GET', 'POST'])
def edit_job_details(job_id):
    db_conn = models.get_db()
    if request.method == 'POST':
        models.update_job(db_conn, job_id, request.form)
        return redirect(url_for('.list_jobs'))
    else:
        job = models.get_job_by_id(db_conn, job_id)
        return render_template("edit_job_details.html", job=job)


_STATUS_VIEW_STRINGS = {
    models.Status.new: "new",
    models.Status.applied: "applied",
    models.Status.init_int: "initial interview",
    models.Status.tech_int: "technical interview",
    models.Status.add_int: "additional interviews",
    models.Status.reject: "rejected",
    models.Status.offer: "offer",
}

@crud_blueprint.route('/set-status/<int:job_id>', methods=['GET', 'POST'])
def set_application_status(job_id):
    db_conn = models.get_db()
    if request.method == 'POST':
        status = models.Status(int(request.form['status']))
        models.set_job_status(db_conn, job_id, status)
        return redirect(url_for('.list_jobs'))
    else:
        job = models.get_job_by_id(db_conn, job_id)
        statuses = [{
            "view_string": _STATUS_VIEW_STRINGS[status],
            "value": status.value,
            "selected": job['status'] == status,
        } for status in _STATUS_VIEW_STRINGS.keys()]
        return render_template("set_status.html", 
                            job=job,
                            statuses=statuses,
                            )



viz_blueprint = Blueprint('viz', __name__)

@viz_blueprint.route('/')
def viz_root():
    return "data viz unimplemented"
