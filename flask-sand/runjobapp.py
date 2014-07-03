#! /usr/bin/env python

from optparse import OptionParser
import sys

from jobapp import app
from jobapp.database import init_db

parser = OptionParser()
parser.add_option("-d", "--init-db",
                  action='store_true', dest='is_initdb', default=False,
                  help="initialize a new database before starting")
(options, args) = parser.parse_args()

if options.is_initdb:
    init_db()

app.run(host='0.0.0.0')
