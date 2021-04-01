from django.urls import path
from . import views

urlpatterns = [
    path('', views.coin_list, name='coin_list'),
]