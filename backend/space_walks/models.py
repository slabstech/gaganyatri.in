from django.db import models

class SpaceWalks(models.Model):
    astronaut = models.CharField(max_length=100)
    duration = models.DurationField()
    date = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255)

    def __str__(self):
        return self.astronaut
