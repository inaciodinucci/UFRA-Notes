"""ufranotes URL Configuration"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse, JsonResponse
from django.views.generic import RedirectView

def api_root(request):
    """Vista para a raiz da API que fornece informação básica"""
    if request.user.is_authenticated:
        return JsonResponse({
            'status': 'authenticated',
            'message': 'Bem-vindo à API UFRA Notes',
            'user': request.user.username,
            'api_endpoints': {
                'auth': '/api/auth/',
                'users': '/api/users/',
                'notes': '/api/notes/',
                'activities': '/api/activities/',
                'admin': '/admin/'
            }
        })
    else:
        return JsonResponse({
            'status': 'unauthenticated',
            'message': 'Bem-vindo à API UFRA Notes',
            'api_endpoints': {
                'auth': '/api/auth/',
                'admin': '/admin/'
            }
        })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    path('api/users/', include('apps.users.urls')),
    path('api/notes/', include('apps.notes.urls')),
    path('api/activities/', include('apps.activities.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) 