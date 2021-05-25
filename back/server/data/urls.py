from django.urls import path
from . import views

urlpatterns = [
    path('getCoinData', views.CreateDataView.as_view()),
    path('getCoinName', views.CreateNameView.as_view()),
]