from django.db import models
from django.utils.translation import gettext_lazy as _


class Activity(models.Model):
    """
    Model for RPG-themed activities
    """
    ACTIVITY_TYPES = [
        ('health', _('Saúde')),
        ('intelligence', _('Inteligência')),
        ('strength', _('Força')),
        ('agility', _('Agilidade')),
    ]
    
    name = models.CharField(_('nome'), max_length=100)
    description = models.TextField(_('descrição'), blank=True)
    activity_type = models.CharField(_('tipo'), max_length=20, choices=ACTIVITY_TYPES)
    icon = models.CharField(_('ícone'), max_length=50, blank=True, help_text=_('Nome do ícone ou emoji'))
    
    class Meta:
        verbose_name = _('atividade')
        verbose_name_plural = _('atividades')
        
    def __str__(self):
        return self.name 