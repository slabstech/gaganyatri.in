from django.contrib import admin

from .models import MyModel
from .models import Article

admin.site.register(MyModel)
admin.site.register(Article)
