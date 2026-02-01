from django.contrib import admin
from .models import MatchResult


@admin.register(MatchResult)
class MatchResultAdmin(admin.ModelAdmin):
    list_display = ('id', 'overall_match', 'skill_match', 'experience_match', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('cv_text', 'jd_text')
    readonly_fields = ('created_at',)
