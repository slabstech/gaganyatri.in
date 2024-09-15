from django.db import models

class SpaceWalks(models.Model):
    column1 = models.CharField(max_length=100)
    column2 = models.IntegerField()
    column3 = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.column1
