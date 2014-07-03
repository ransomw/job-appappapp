import os

from flask import Flask

import config

_SETTINGS_ENV_VAR = 'FLASK_JOBAPP_SETTINGS'

app = Flask(__name__)
if os.environ.get(_SETTINGS_ENV_VAR):
    app.config.from_envvar(_SETTINGS_ENV_VAR)
else:
    app.config.from_object(config)

import jobapp.views
