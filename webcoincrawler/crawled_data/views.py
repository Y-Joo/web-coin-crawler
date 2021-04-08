from django.shortcuts import render
from .models import BlogData
def BlogData_list(request):
    context = {
        "BlogDatas": BlogData.objects.all()
    }
    return render(request, 'crawled_data/coin_calender.html', context)
# Create your views here.
