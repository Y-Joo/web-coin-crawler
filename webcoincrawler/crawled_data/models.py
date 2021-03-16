from django.db import models
# Create your models here.
class BoardData(models.Model):
    title = models.CharField(max_length=300)
    detail = models.CharField(max_length=10000)
    coin_name=models.CharField(max_length=30)
    added_date=models.DateTimeField()
    gn_date=models.DateTimeField()