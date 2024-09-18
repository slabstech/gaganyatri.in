from django.db import models

class SpaceWalks(models.Model):
    astronaut = models.CharField(max_length=100)
    date = models.DateField()
    duration = models.DurationField()
    description = models.TextField()

    def __str__(self):
        return f"{self.astronaut} - {self.date}"

    class Meta:
        ordering = ['-date']