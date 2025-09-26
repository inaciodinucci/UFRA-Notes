from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Note, Checkbox, Connection

User = get_user_model()


class NoteModelTest(TestCase):
    """Test cases for Note model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.note_data = {
            'title': 'Test Note',
            'content': 'This is a test note',
            'user': self.user,
            'xp_value': 5
        }
    
    def test_create_note(self):
        """Test note creation"""
        note = Note.objects.create(**self.note_data)
        self.assertEqual(note.title, 'Test Note')
        self.assertEqual(note.user, self.user)
        self.assertEqual(note.xp_value, 5)
        self.assertFalse(note.has_checkboxes)
        self.assertFalse(note.all_checked)
    
    def test_note_xp_limits(self):
        """Test XP value limits"""
        # Test XP value above limit
        note = Note(title='Test', content='Test', user=self.user, xp_value=15)
        note.save()
        self.assertEqual(note.xp_value, 10)
        
        # Test XP value below limit
        note = Note(title='Test', content='Test', user=self.user, xp_value=0)
        note.save()
        self.assertEqual(note.xp_value, 1)


class CheckboxModelTest(TestCase):
    """Test cases for Checkbox model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.note = Note.objects.create(
            title='Test Note',
            content='Test content',
            user=self.user
        )
    
    def test_create_checkbox(self):
        """Test checkbox creation"""
        checkbox = Checkbox.objects.create(
            note=self.note,
            text='Test checkbox',
            order=1
        )
        self.assertEqual(checkbox.text, 'Test checkbox')
        self.assertEqual(checkbox.note, self.note)
        self.assertFalse(checkbox.is_checked)
        self.assertEqual(checkbox.order, 1)
    
    def test_checkbox_updates_note_status(self):
        """Test that checkbox updates note's all_checked status"""
        checkbox1 = Checkbox.objects.create(note=self.note, text='Checkbox 1', order=1)
        checkbox2 = Checkbox.objects.create(note=self.note, text='Checkbox 2', order=2)
        
        # Initially not all checked
        self.assertFalse(self.note.all_checked)
        
        # Check all checkboxes
        checkbox1.is_checked = True
        checkbox1.save()
        checkbox2.is_checked = True
        checkbox2.save()
        
        self.note.refresh_from_db()
        self.assertTrue(self.note.all_checked)


class NoteAPITest(APITestCase):
    """Test cases for Note API endpoints"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.note = Note.objects.create(
            title='Test Note',
            content='Test content',
            user=self.user
        )
    
    def test_create_note(self):
        """Test creating a note via API"""
        self.client.force_authenticate(user=self.user)
        url = reverse('note-list')
        data = {
            'title': 'New Note',
            'content': 'New content',
            'xp_value': 5
        }
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Note.objects.count(), 2)
    
    def test_retrieve_note(self):
        """Test retrieving a note via API"""
        self.client.force_authenticate(user=self.user)
        url = reverse('note-detail', kwargs={'pk': self.note.pk})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.note.title)
    
    def test_update_note(self):
        """Test updating a note via API"""
        self.client.force_authenticate(user=self.user)
        url = reverse('note-detail', kwargs={'pk': self.note.pk})
        data = {'title': 'Updated Title'}
        response = self.client.patch(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.note.refresh_from_db()
        self.assertEqual(self.note.title, 'Updated Title')
    
    def test_delete_note(self):
        """Test deleting a note via API"""
        self.client.force_authenticate(user=self.user)
        url = reverse('note-detail', kwargs={'pk': self.note.pk})
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Note.objects.count(), 0)
