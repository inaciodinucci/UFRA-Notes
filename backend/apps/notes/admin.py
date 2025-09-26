from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Note, Checkbox, Connection


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    """Admin configuration for Note model"""
    list_display = ('title', 'user', 'created_at', 'has_checkboxes', 'all_checked', 'xp_value')
    list_filter = ('has_reminder', 'has_checkboxes', 'all_checked', 'reminder_frequency', 'created_at')
    search_fields = ('title', 'content', 'user__username', 'user__email')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        (None, {'fields': ('title', 'content', 'user')}),
        (_('Reminder Settings'), {'fields': ('has_reminder', 'reminder_datetime', 'reminder_frequency')}),
        (_('Checkbox Settings'), {'fields': ('has_checkboxes', 'all_checked')}),
        (_('RPG Settings'), {'fields': ('xp_value', 'activities')}),
        (_('Timestamps'), {'fields': ('created_at', 'updated_at')}),
    )


@admin.register(Checkbox)
class CheckboxAdmin(admin.ModelAdmin):
    """Admin configuration for Checkbox model"""
    list_display = ('text', 'note', 'is_checked', 'order')
    list_filter = ('is_checked', 'note__user')
    search_fields = ('text', 'note__title')
    ordering = ('note', 'order')
    list_editable = ('is_checked', 'order')


@admin.register(Connection)
class ConnectionAdmin(admin.ModelAdmin):
    """Admin configuration for Connection model"""
    list_display = ('source', 'target', 'label', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('source__title', 'target__title', 'label')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
