from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()

class MyModel(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()