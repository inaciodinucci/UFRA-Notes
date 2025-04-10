from celery import shared_task
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
import datetime
from .models import Note


@shared_task
def send_reminder_notifications():
    """
    Task to send reminder notifications for notes
    """
    now = timezone.now()
    
    # Find notes with reminders due now
    due_reminders = Note.objects.filter(
        has_reminder=True,
        reminder_datetime__lte=now
    )
    
    for note in due_reminders:
        # Send email notification
        send_mail(
            subject=f'Lembrete: {note.title}',
            message=f'''
            Olá {note.user.first_name or note.user.username},
            
            Este é um lembrete para a sua nota: {note.title}
            
            Conteúdo:
            {note.content[:200]}{'...' if len(note.content) > 200 else ''}
            
            Acesse o UFRA Notes para mais detalhes.
            ''',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[note.user.email],
            fail_silently=True,
        )
        
        # Update reminder based on frequency
        if note.reminder_frequency == 'daily':
            note.reminder_datetime = now + datetime.timedelta(days=1)
        elif note.reminder_frequency == 'weekly':
            note.reminder_datetime = now + datetime.timedelta(weeks=1)
        elif note.reminder_frequency == 'monthly':
            note.reminder_datetime = now + datetime.timedelta(days=30)
        else:
            # If no repeat, disable reminder
            note.has_reminder = False
            note.reminder_datetime = None
        
        note.save()
    
    return f"Sent {due_reminders.count()} reminders" 