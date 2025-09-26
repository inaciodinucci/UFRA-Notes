from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Activity


class ActivityModelTest(TestCase):
    """Test cases for Activity model"""
    
    def setUp(self):
        self.activity_data = {
            'name': 'Test Activity',
            'description': 'This is a test activity',
            'activity_type': 'intelligence',
            'icon': '🧠'
        }
    
    def test_create_activity(self):
        """Test activity creation"""
        activity = Activity.objects.create(**self.activity_data)
        self.assertEqual(activity.name, 'Test Activity')
        self.assertEqual(activity.activity_type, 'intelligence')
        self.assertEqual(activity.icon, '🧠')
        self.assertTrue(activity.description)
    
    def test_activity_str_representation(self):
        """Test activity string representation"""
        activity = Activity.objects.create(**self.activity_data)
        self.assertEqual(str(activity), 'Test Activity')


class ActivityAPITest(APITestCase):
    """Test cases for Activity API endpoints"""
    
    def setUp(self):
        self.activity = Activity.objects.create(
            name='Test Activity',
            description='Test description',
            activity_type='intelligence',
            icon='🧠'
        )
    
    def test_list_activities(self):
        """Test listing activities via API"""
        url = reverse('activity-list')
        response = self.client.get(url)
        
        # Should require authentication
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_retrieve_activity(self):
        """Test retrieving an activity via API"""
        url = reverse('activity-detail', kwargs={'pk': self.activity.pk})
        response = self.client.get(url)
        
        # Should require authentication
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
