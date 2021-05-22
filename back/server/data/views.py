from django.http import HttpResponse, HttpRequest, JsonResponse
from django.shortcuts import render
from httplib2 import Response
from rest_framework import generics
from .serializers import DataSerializer
from .models import CoinData
import sys

from django.views.generic import View

class CreateDataView(generics.ListCreateAPIView):
    serializer_class = DataSerializer
    queryset = CoinData.objects
