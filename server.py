import werkzeug
import flask
from flask import jsonify
from flask import render_template


app = flask.Flask(__name__, template_folder='srv_templates', static_folder='srv_static')

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/hello")
def hello_world():
    return jsonify({"message": "hello from flask"})

werkzeug.serving.run_simple(
    "0.0.0.0",
    5000,
    app,
    use_debugger=True,
    use_reloader=True,
)
