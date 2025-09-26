from django.contrib.auth import get_user_model
from rest_framework import serializers
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer

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

class UserCreateSerializer(BaseUserCreateSerializer):
    """
    Serializer for user creation
    """
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']

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