from django.db import models

from pdb import set_trace as st

class Industry(models.Model):
    name = models.CharField(max_length=50)

    def __unicode__(self):
        return self.name

class Company(models.Model):
    industry = models.ForeignKey(Industry)
    name = models.CharField(max_length=100)

    def __unicode__(self):
        return self.name

class Interview(models.Model):
    company = models.ForeignKey(Company)
    notes = models.TextField()
    date = models.DateField()

    # todo: __unicode__ method
    # that includes comapny name and date
