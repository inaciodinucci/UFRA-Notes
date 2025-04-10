from rest_framework import serializers
from .models import Note, Checkbox, Connection, Activity


class ActivitySerializer(serializers.ModelSerializer):
    """
    Serializer for Activity model
    """
    class Meta:
        model = Activity
        fields = ['id', 'name', 'description', 'activity_type', 'icon']


class CheckboxSerializer(serializers.ModelSerializer):
    """
    Serializer for Checkbox model
    """
    class Meta:
        model = Checkbox
        fields = ['id', 'text', 'is_checked', 'order']


class ConnectionSerializer(serializers.ModelSerializer):
    """
    Serializer for Connection model
    """
    source_title = serializers.CharField(source='source.title', read_only=True)
    target_title = serializers.CharField(source='target.title', read_only=True)
    
    class Meta:
        model = Connection
        fields = ['id', 'source', 'target', 'source_title', 'target_title', 'label', 'created_at']


class NoteSerializer(serializers.ModelSerializer):
    """
    Serializer for Note model
    """
    checkboxes = CheckboxSerializer(many=True, read_only=True)
    activities = ActivitySerializer(many=True, read_only=True)
    
    class Meta:
        model = Note
        fields = [
            'id', 'title', 'content', 'user', 'created_at', 'updated_at',
            'has_reminder', 'reminder_datetime', 'reminder_frequency',
            'has_checkboxes', 'all_checked', 'xp_value', 'activities', 'checkboxes'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at', 'all_checked']
    
    def create(self, validated_data):
        """
        Override create to set the user from the request
        """
        user = self.context['request'].user
        note = Note.objects.create(user=user, **validated_data)
        return note


class NoteDetailSerializer(NoteSerializer):
    """
    Extended serializer for Note model with connections
    """
    outgoing_connections = ConnectionSerializer(many=True, read_only=True)
    incoming_connections = ConnectionSerializer(many=True, read_only=True)
    
    class Meta(NoteSerializer.Meta):
        fields = NoteSerializer.Meta.fields + ['outgoing_connections', 'incoming_connections'] 