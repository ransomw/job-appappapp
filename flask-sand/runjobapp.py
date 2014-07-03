#! /usr/bin/env python

import sys

from jobapp import app
# from jobapp.database import init_db

# if 'initdb' in sys.argv:
#     init_db()

app.run(host='0.0.0.0')
