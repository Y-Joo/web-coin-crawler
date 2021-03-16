from django.shortcuts import render
def coin_list(request):
    return render(request, 'crawled_data/coin_calender.html', {})
# Create your views here.
