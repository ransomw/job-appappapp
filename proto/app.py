import werkzeug
import flask

from views import crud_blueprint, viz_blueprint


def build_app():
    app = flask.Flask(__name__)

    app.register_blueprint(crud_blueprint)
    app.register_blueprint(viz_blueprint, url_prefix="/viz")

    return app

if __name__ == '__main__':
    app = build_app()
    werkzeug.serving.run_simple(
        "0.0.0.0",
        5000,
        app,
        use_debugger=True,
    )

