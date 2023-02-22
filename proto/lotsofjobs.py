from sqlalchemy import Connection
from sqlalchemy import insert, select

from models import connect_db
import models

jobs = [{
    'title': 'clojure developer',
    'company': 'apple',
    'description': 'apple is hiring clojure devs',
}]

conn: Connection = connect_db()

for one_job in jobs:
    stmt = insert(models.job_table).values(
        title=one_job['title'],
        company=one_job['company'],
        description=one_job['description'],
        status=models.Status.new,
    )
    conn.execute(stmt)
conn.commit()

sel_stmt = select(models.job_table)
res = conn.execute(sel_stmt)
rows = res.mappings().all()

print(rows)
