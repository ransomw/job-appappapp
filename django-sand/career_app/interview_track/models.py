from django.db import models
from django.core.exceptions import ValidationError

from pdb import set_trace as st

class Industry(models.Model):
    name = models.CharField(max_length=50)

    def __unicode__(self):
        return self.name

class Recruiter(models.Model):
    industry = models.ForeignKey(Industry)
    name = models.CharField(max_length=100)
    email = models.EmailField()

    def __unicode__(self):
        return self.name

class Company(models.Model):
    industry = models.ForeignKey(Industry)
    name = models.CharField(max_length=100)
    recruiter = models.ForeignKey(Recruiter, null=True, blank=True)

    def __unicode__(self):
        return self.name

    def clean(self):
        if (self.recruiter != None and
            (self.recruiter.industry.id !=
             self.industry.id)):
            raise ValidationError(
                "recruiter industry must match company industry")

class Interview(models.Model):
    company = models.ForeignKey(Company, null=True, blank=True)
    recruiter = models.ForeignKey(Recruiter, null=True, blank=True)
    notes = models.TextField()
    date = models.DateField()

    def assoc_recruiter(self):
        if self.recruiter != None:
            return self.recruiter
        elif self.company.recruiter != None:
            return self.company.recruiter
        else:
            return None

    def __unicode__(self):
        if self.company != None:
            name = self.company.name
        else:
            name = self.recruiter.name
        return name + ' on ' + str(self.date)

    def clean(self):
        if len(filter(lambda field: field is None,
                      [self.company, self.recruiter])) != 1:
            raise ValidationError((
                "an interview "
                "must occur with either a company or recruiter "
                "but not both"))

class Reading(models.Model):
    interview = models.ForeignKey(Interview)
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
