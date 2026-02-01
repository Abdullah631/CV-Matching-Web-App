from django.urls import path
from .views import PredictionView, FileUploadPredictionView, supported_formats

urlpatterns = [
    path('predict/', PredictionView.as_view(), name='predict'),
    path('predict-with-files/', FileUploadPredictionView.as_view(), name='predict-with-files'),
    path('supported-formats/', supported_formats, name='supported-formats'),
]
