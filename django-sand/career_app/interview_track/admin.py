from django.contrib import admin
from interview_track.models import (
    Industry,
    Company,
    Interview,
)

class CompanyAdmin(admin.ModelAdmin):
    fields = ['name', 'industry']

class InterviewAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields': ['company', 'date']}),
        ('notes', {'fields': ['notes'],
                   # 'classes': ['collapse'],
               }),
     ]

admin.site.register(Industry)
admin.site.register(Company, CompanyAdmin)
admin.site.register(Interview, InterviewAdmin)
