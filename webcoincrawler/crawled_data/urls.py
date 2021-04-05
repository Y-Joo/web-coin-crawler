from django.urls import path
from . import views

urlpatterns = [
    path('', views.BlogData_list, name='coin_list'),
]