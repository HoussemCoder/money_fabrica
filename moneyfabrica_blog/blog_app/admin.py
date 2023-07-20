from django.contrib import admin
from . import models

class ArticlesDB(admin.ModelAdmin):
    list_display = ("title", )
    list_per_page = 10

class CategoriesDB(admin.ModelAdmin):
    list_display = ("title", )

class UsersEmailsDB(admin.ModelAdmin):
    list_display = ("email", )
    list_per_page = 20

class ContactHistoryDB(admin.ModelAdmin):
    list_display = ("subject", )
    list_per_page = 20

admin.site.register(models.Articles, ArticlesDB)
admin.site.register(models.Categories, CategoriesDB)
admin.site.register(models.UsersEmails, UsersEmailsDB)
admin.site.register(models.ContactsHistory, ContactHistoryDB)