from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import Note, Checkbox, Connection, Activity
from .serializers import (
    NoteSerializer, NoteDetailSerializer, CheckboxSerializer,
    ConnectionSerializer, ActivitySerializer
)

User = get_user_model()


class NoteViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Note model
    """
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Return notes for the current user
        """
        return Note.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        """
        Return appropriate serializer class
        """
        if self.action in ['retrieve', 'update', 'partial_update']:
            return NoteDetailSerializer
        return NoteSerializer
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """
        Mark note as completed and award XP to user
        """
        note = self.get_object()
        user = request.user
        
        # Only award XP if not already completed
        if not note.all_checked:
            # Add XP to user
            user.add_xp(note.xp_value)
            
            # Update user stats based on activities
            for activity in note.activities.all():
                if activity.activity_type == 'health':
                    user.health += 1
                elif activity.activity_type == 'intelligence':
                    user.intelligence += 1
                elif activity.activity_type == 'strength':
                    user.strength += 1
                elif activity.activity_type == 'agility':
                    user.agility += 1
            
            user.save()
            
            # Mark note as completed by setting all checkboxes to checked
            if note.has_checkboxes:
                for checkbox in note.checkboxes.all():
                    checkbox.is_checked = True
                    checkbox.save()
                note.all_checked = True
                note.save()
            
            return Response({'status': 'success', 'xp_gained': note.xp_value})
        
        return Response({'status': 'already completed'})
    
    @action(detail=False, methods=['get'])
    def mindmap(self, request):
        """
        Return data for the mind map visualization
        """
        notes = self.get_queryset()
        connections = Connection.objects.filter(
            Q(source__in=notes) | Q(target__in=notes)
        )
        
        note_serializer = NoteSerializer(notes, many=True)
        connection_serializer = ConnectionSerializer(connections, many=True)
        
        return Response({
            'notes': note_serializer.data,
            'connections': connection_serializer.data
        })


class CheckboxViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Checkbox model
    """
    serializer_class = CheckboxSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Return checkboxes for the current user's notes
        """
        return Checkbox.objects.filter(note__user=self.request.user)
    
    def perform_create(self, serializer):
        """
        Ensure the checkbox belongs to the user's note
        """
        note_id = self.request.data.get('note')
        if note_id:
            note = Note.objects.filter(id=note_id, user=self.request.user).first()
            if note:
                serializer.save(note=note)
            else:
                raise permissions.PermissionDenied("This note doesn't belong to you.")
        else:
            raise serializers.ValidationError("Note ID is required.")


class ConnectionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Connection model
    """
    serializer_class = ConnectionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Return connections for the current user's notes
        """
        user_notes = Note.objects.filter(user=self.request.user)
        return Connection.objects.filter(
            Q(source__in=user_notes) | Q(target__in=user_notes)
        )
    
    def perform_create(self, serializer):
        """
        Ensure both notes belong to the current user
        """
        source_id = self.request.data.get('source')
        target_id = self.request.data.get('target')
        
        if source_id and target_id:
            source = Note.objects.filter(id=source_id, user=self.request.user).first()
            target = Note.objects.filter(id=target_id, user=self.request.user).first()
            
            if source and target:
                serializer.save()
            else:
                raise permissions.PermissionDenied("Both notes must belong to you.")
        else:
            raise serializers.ValidationError("Source and target note IDs are required.")


class ActivityViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Activity model
    """
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated] 