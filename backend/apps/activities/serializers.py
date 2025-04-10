from rest_framework import serializers
from .models import Activity


class ActivitySerializer(serializers.ModelSerializer):
    """
    Serializer for Activity model
    """
    class Meta:
        model = Activity
        fields = ['id', 'name', 'description', 'activity_type', 'icon'] 