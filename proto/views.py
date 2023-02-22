from flask import render_template
from flask import Blueprint

crud_blueprint = Blueprint('crud', __name__)

@crud_blueprint.route('/')
def list_jobs():
    return render_template("list.html")


@crud_blueprint.route('/new')
def add_new_job():
    return render_template("add_new.html")


@crud_blueprint.route('/set-status')
def set_application_status():
    return render_template("set_status.html")



viz_blueprint = Blueprint('viz', __name__)

@viz_blueprint.route('/')
def viz_root():
    return "data viz unimplemented"
