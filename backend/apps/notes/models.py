from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

User = get_user_model()

class Note(models.Model):
    """
    Model for notes with RPG-themed features
    """
    REMINDER_FREQUENCY_CHOICES = [
        ('none', _('Nenhum')),
        ('daily', _('Diário')),
        ('weekly', _('Semanal')),
        ('monthly', _('Mensal')),
    ]
    
    title = models.CharField(_('título'), max_length=200)
    content = models.TextField(_('conteúdo'))
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes', verbose_name=_('usuário'))
    created_at = models.DateTimeField(_('criado em'), auto_now_add=True)
    updated_at = models.DateTimeField(_('atualizado em'), auto_now=True)
    
    # Reminder features
    has_reminder = models.BooleanField(_('possui lembrete'), default=False)
    reminder_datetime = models.DateTimeField(_('data e hora do lembrete'), null=True, blank=True)
    reminder_frequency = models.CharField(_('frequência do lembrete'), max_length=10, choices=REMINDER_FREQUENCY_CHOICES, default='none')
    
    # Checkbox features
    has_checkboxes = models.BooleanField(_('possui checkboxes'), default=False)
    all_checked = models.BooleanField(_('todos marcados'), default=False)
    
    # RPG features
    xp_value = models.PositiveIntegerField(_('valor de XP'), default=5, help_text=_('Valor de XP entre 1 e 10'))
    activities = models.ManyToManyField('activities.Activity', verbose_name=_('atividades'), blank=True)
    
    class Meta:
        verbose_name = _('nota')
        verbose_name_plural = _('notas')
        ordering = ['-created_at']
        
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        """Override save to enforce XP limit"""
        if self.xp_value > 10:
            self.xp_value = 10
        elif self.xp_value < 1:
            self.xp_value = 1
            
        super().save(*args, **kwargs)


class Checkbox(models.Model):
    """
    Model for checkboxes within notes
    """
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='checkboxes', verbose_name=_('nota'))
    text = models.CharField(_('texto'), max_length=255)
    is_checked = models.BooleanField(_('marcado'), default=False)
    order = models.PositiveIntegerField(_('ordem'), default=0)
    
    class Meta:
        verbose_name = _('checkbox')
        verbose_name_plural = _('checkboxes')
        ordering = ['order']
        
    def __str__(self):
        return f"{self.text} ({'✓' if self.is_checked else '✗'})"
    
    def save(self, *args, **kwargs):
        """Override save to update note's all_checked status"""
        super().save(*args, **kwargs)
        
        # Update the note's all_checked status
        note = self.note
        all_checkboxes = note.checkboxes.all()
        if all_checkboxes:
            note.all_checked = all(checkbox.is_checked for checkbox in all_checkboxes)
            note.save(update_fields=['all_checked'])


class Connection(models.Model):
    """
    Model for connections between notes (for the mental map feature)
    """
    source = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='outgoing_connections', verbose_name=_('origem'))
    target = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='incoming_connections', verbose_name=_('destino'))
    label = models.CharField(_('rótulo'), max_length=100, blank=True)
    created_at = models.DateTimeField(_('criado em'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('conexão')
        verbose_name_plural = _('conexões')
        unique_together = ('source', 'target')
        
    def __str__(self):
        return f"{self.source.title} → {self.target.title}" 