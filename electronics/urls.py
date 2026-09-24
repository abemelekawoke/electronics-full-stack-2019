"""
electronics URL Configuration
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import RedirectView

from rest_framework.routers import DefaultRouter
from store.views import ContactMessageViewSet

from django.conf import settings
from django.conf.urls.static import static
from . import views

# starts
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls import *
admin.autodiscover()

from django.views.static import serve
from django.views.decorators.csrf import csrf_exempt
# ends

admin.site.site_header = "Parrot Advert Admin"
admin.site.site_title = "Parrot Advert Admin Portal"
admin.site.index_title = "Parrot Advert Administration"
router = DefaultRouter()
router.register(r'contact', ContactMessageViewSet, basename='contact')
# Define main URL patterns
urlpatterns = [
    path('chaining/', include('smart_selects.urls')),
    path('api/dashboard/', admin.site.urls),
    path('api/accounts/', include('allauth.urls')),
    path('api/', include(router.urls)),
    path('api/store/', include('store.urls')),  # ADD THIS LINE
    path('api/', include('setups.urls')),
    # path('auth/', include('allauth.urls')),  # allauth handles OAuth completely
    path('api/v1/', include('store.urls')),
    path('api/v1/check-auth/', views.check_user, name='check_user'),
    path('api/v1/logout/', views.logout_view, name='logout'),
    # path('', views.home, name='home'),
    path('api/orders/', include('orders.urls')),
    path('api/sales/', include('sales.urls')),
    # Catch-all route to serve React app for all other routes (must be last)
    # re_path(r'^.*$', views.home, name='home_catchall'),
]
urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Serve static files from React build and public folders
if settings.DEBUG:
    import os
    from django.views.static import serve
    from django.urls import re_path
    
    # Serve React build folder (for favicon/logo)
    react_build = os.path.join(settings.BASE_DIR, 'electronics-frontend', 'build')
    
    # Explicitly serve logo and favicon from build folder
    static_urlpatterns = [
        re_path(r'^logo\.PNG$', serve, {'document_root': react_build, 'path': 'logo.PNG'}),
        re_path(r'^favicon\.ico$', serve, {'document_root': react_build, 'path': 'favicon.ico'}),
        re_path(r'^(manifest\.json|robots\.txt)$', serve, {'document_root': react_build}),
    ]
    
    # Serve media folder (for user-uploaded files in media/device_images)
    static_urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
    # Serve static files from static folder
    static_urlpatterns += static(settings.STATIC_URL, document_root=settings.BASE_DIR / 'static')
    
    # Combine: static patterns FIRST, then main patterns
    urlpatterns = static_urlpatterns + urlpatterns
else:
    urlpatterns = urlpatterns

