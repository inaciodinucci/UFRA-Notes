from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'profile_image', 'level', 'xp', 'health', 'intelligence', 
                  'strength', 'agility']
        read_only_fields = ['level', 'xp']

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile details
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'profile_image', 'level', 'xp', 'health', 'intelligence', 
                  'strength', 'agility']
        read_only_fields = ['email', 'level', 'xp'] 