from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Activity


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    """Admin configuration for Activity model"""
    list_display = ('name', 'activity_type', 'icon')
    list_filter = ('activity_type',)
    search_fields = ('name', 'description')
    ordering = ('name',)
    
    fieldsets = (
        (None, {'fields': ('name', 'description')}),
        (_('Type & Icon'), {'fields': ('activity_type', 'icon')}),
    )
