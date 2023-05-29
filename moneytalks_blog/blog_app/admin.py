from django.contrib import admin
from . import models

class ArticlesDB(admin.ModelAdmin):
    list_display = ("slug", )
    list_per_page = 10

class CategoriesDB(admin.ModelAdmin):
    list_display = ("title", )


admin.site.register(models.Articles, ArticlesDB)
admin.site.register(models.Categories, CategoriesDB)
