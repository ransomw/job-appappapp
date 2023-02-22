import werkzeug
import flask
from flask import jsonify


app = flask.Flask(__name__)

@app.route("/")
def home():
    return jsonify({"message": "hello from flask"})

werkzeug.serving.run_simple(
    "0.0.0.0",
    5000,
    app,
    use_debugger=True,
)
