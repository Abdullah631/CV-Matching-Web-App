from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MatchResultViewSet

router = DefaultRouter()
router.register(r'matches', MatchResultViewSet, basename='match')

urlpatterns = [
    path('', include(router.urls)),
]
