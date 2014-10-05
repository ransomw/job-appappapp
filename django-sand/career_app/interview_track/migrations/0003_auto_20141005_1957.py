# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('interview_track', '0002_interview'),
    ]

    operations = [
        migrations.CreateModel(
            name='Reading',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=100)),
                ('author', models.CharField(max_length=100)),
                ('interview', models.ForeignKey(to='interview_track.Interview')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Recruiter',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=75)),
                ('industry', models.ForeignKey(to='interview_track.Industry')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='company',
            name='recruiter',
            field=models.ForeignKey(to='interview_track.Recruiter', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='interview',
            name='recruiter',
            field=models.ForeignKey(to='interview_track.Recruiter', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='interview',
            name='company',
            field=models.ForeignKey(to='interview_track.Company', null=True),
        ),
    ]
