import werkzeug
import flask
from flask import g
from sqlalchemy import Connection

from views import crud_blueprint, viz_blueprint
import models


def build_app():
    app = flask.Flask(__name__)

    app.register_blueprint(crud_blueprint)
    app.register_blueprint(viz_blueprint, url_prefix="/viz")

    @app.teardown_appcontext
    def teardown_db(exception):
        db: Connection = g.pop('db', None)
        if db is not None:
            db.close()

    return app

if __name__ == '__main__':
    app = build_app()
    werkzeug.serving.run_simple(
        "0.0.0.0",
        5000,
        app,
        use_debugger=True,
    )

