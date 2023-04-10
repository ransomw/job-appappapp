from sqlalchemy import Connection
from sqlalchemy import insert, select, text

from models import connect_db
import models

jobs = [{
    'title': 'clojure developer',
    'company': 'apple',
    'description': 'apple is hiring clojure devs',
}]

contact_alice = {
    'name': 'alice',
    'company': 'medium',
    'email': 'a@a.com',
    'phone': '6015551234',
    'notes': "someone i used to know",
}

contact_bill = {
    'name': 'bill',
    'company': 'bargible',
    'email': 'b@b.com',
    'phone': '4155551234',
    'notes': "a good guy",
}

conn: Connection = connect_db()

stmt = insert(models.contact_table).values(
    name=contact_alice['name'],
    company=contact_alice['company'],
    email=contact_alice['email'],
    phone=contact_alice['phone'],
    notes=contact_alice['notes'],
    intro_id=None,
).returning(models.contact_table.c.id)

res = conn.execute(stmt)
alice_id = res.scalar_one()
conn.commit()

stmt = insert(models.contact_table).values(
    name=contact_bill['name'],
    company=contact_bill['company'],
    email=contact_bill['email'],
    phone=contact_bill['phone'],
    notes=contact_bill['notes'],
    intro_id=alice_id,
)
conn.execute(stmt)
conn.commit()


contact_alias_1 = models.contact_table.alias()
sel_stmt = select(models.contact_table, 
                  contact_alias_1.c.id, contact_alias_1.c.name).outerjoin(
    contact_alias_1,
    contact_alias_1.c.id == models.contact_table.c.intro_id)
res = conn.execute(sel_stmt)
res_mappings = res.mappings().all()

print(res_mappings)

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
