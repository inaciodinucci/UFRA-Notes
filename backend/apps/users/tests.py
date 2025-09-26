from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

User = get_user_model()


class UserModelTest(TestCase):
    """Test cases for User model"""
    
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User'
        }
    
    def test_create_user(self):
        """Test user creation"""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.level, 1)
        self.assertEqual(user.xp, 0)
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
    
    def test_add_xp(self):
        """Test XP addition and level up"""
        user = User.objects.create_user(**self.user_data)
        initial_xp = user.xp
        initial_level = user.level
        
        user.add_xp(50)
        self.assertEqual(user.xp, initial_xp + 50)
        
        # Test level up (level * 100 XP needed)
        user.add_xp(100)
        self.assertEqual(user.level, initial_level + 1)


class UserAPITest(APITestCase):
    """Test cases for User API endpoints"""
    
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        self.user = User.objects.create_user(**self.user_data)
    
    def test_user_profile_retrieval(self):
        """Test retrieving user profile"""
        self.client.force_authenticate(user=self.user)
        url = reverse('user-me')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)
        self.assertEqual(response.data['email'], self.user.email)
    
    def test_user_profile_update(self):
        """Test updating user profile"""
        self.client.force_authenticate(user=self.user)
        url = reverse('user-me')
        data = {'first_name': 'Updated Name'}
        response = self.client.patch(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Updated Name')
