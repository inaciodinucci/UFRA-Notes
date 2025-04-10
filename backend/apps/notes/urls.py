from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoteViewSet, CheckboxViewSet, ConnectionViewSet, ActivityViewSet

router = DefaultRouter()
router.register('notes', NoteViewSet, basename='note')
router.register('checkboxes', CheckboxViewSet, basename='checkbox')
router.register('connections', ConnectionViewSet, basename='connection')
router.register('activities', ActivityViewSet, basename='activity')

urlpatterns = [
    path('', include(router.urls)),
] 