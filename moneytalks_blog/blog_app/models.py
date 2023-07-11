from django.db import models

class Articles(models.Model):
    title = models.CharField(max_length=200, unique=True)
    content = models.TextField()
    pub_date = models.DateField(auto_now_add=True)
    category = models.CharField(max_length=50)
    tags = models.CharField(max_length=200)
    thumbnail = models.ImageField(unique=True)
    slug = models.CharField(max_length=200, unique=True)
    views = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)


class Categories(models.Model):
    title = models.CharField(max_length=200, unique=True)
    paragraph = models.TextField()
    logo = models.ImageField(unique=True)
    slug = models.CharField(max_length=200, unique=True)
    

class UsersEmails(models.Model):
    email = models.EmailField(max_length=255, unique=True)
    created_at = models.DateField(auto_now_add=True)
    confirmation_code = models.CharField(max_length=100, unique=True, blank=True)
    confirmation_delete = models.CharField(max_length=100, blank=True)
    expiration_time = models.CharField(max_length=30, blank=True)
    is_valid = models.BooleanField(default=False)


class ContactsHistory(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField(max_length=300)
    subject = models.CharField(max_length=300)
    message = models.TextField(max_length=10000)
    date = models.DateField(auto_now_add=True)
    checked = models.BooleanField(default=False)