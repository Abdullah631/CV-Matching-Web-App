"""
URL configuration for cvmatcher project.
"""

from django.urls import path, include

urlpatterns = [
    path('api/', include('api.urls')),
]
