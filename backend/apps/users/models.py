from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser
    """
    email = models.EmailField(_('endereço de email'), unique=True)
    profile_image = models.ImageField(_('imagem de perfil'), upload_to='profile_images/', null=True, blank=True)
    level = models.PositiveIntegerField(_('nível'), default=1)
    xp = models.PositiveIntegerField(_('pontos de experiência'), default=0)
    
    # RPG Attributes
    health = models.PositiveIntegerField(_('saúde'), default=1)
    intelligence = models.PositiveIntegerField(_('inteligência'), default=1)
    strength = models.PositiveIntegerField(_('força'), default=1)
    agility = models.PositiveIntegerField(_('agilidade'), default=1)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        verbose_name = _('usuário')
        verbose_name_plural = _('usuários')
        
    def __str__(self):
        return self.username
    
    def add_xp(self, amount):
        """Add experience points to user and level up if needed"""
        self.xp += amount
        
        # Check if user should level up
        # Formula: level * 100 XP needed for next level (simple RPG progression)
        xp_needed = self.level * 100
        
        if self.xp >= xp_needed and self.level < 20:  # Max level: 20
            self.level += 1
            self.xp -= xp_needed
            # Possible hook for special actions when user levels up
            
        self.save() 