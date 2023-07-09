# job-appappapp

A web application to help with applying for jobs appropriately.

### status

There are beginnings two web apps here:  "web 1.0" (i.e. -- mostly rendered on the server-side) prototyping of features and "web 2.0" (i.e. -- distinctly defined client- and server-sides) development of fuller, polished features.

### usage

`npm install`

`python -m venv .venv`

`. ./.venv/bin/activate`

`pip install -r requirements.txt`

##### web 1.0

`python proto/initdb.py`

`python proto/app.py`

and direct the browser to `localhost` at the port indicated in the log messages.

##### web 2.0

`python server gql-schema`

`npm run build:gql`

`python server.py run-app`

`npm start`

and direct the browser to `localhost` at the port indicated in the `npm` log messages.
