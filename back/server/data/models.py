from django.db import models

class CoinData(models.Model):
    title = models.CharField(max_length=200)
    content = models.JSONField(default=dict)

    def __str__(self):
       return self.title
       