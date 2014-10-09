from django.contrib import admin
from interview_track.models import (
    Industry,
    Recruiter,
    Company,
    Interview,
    Reading
)

class CompanyAdmin(admin.ModelAdmin):
    fields = ['name', 'industry', 'recruiter']

class ReadingInline(admin.StackedInline):
    model = Reading
    extra = 1

class InterviewAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields': ['company', 'recruiter', 'date']}),
        ('notes', {'fields': ['notes'],
                   # 'classes': ['collapse'],
               }),
     ]
    inlines = [ReadingInline]
    list_display = ('company', 'date', 'assoc_recruiter')
    list_filter = ['date', 'company']
    search_fields = ['notes']

admin.site.register(Industry)
admin.site.register(Recruiter)
admin.site.register(Company, CompanyAdmin)
admin.site.register(Interview, InterviewAdmin)
