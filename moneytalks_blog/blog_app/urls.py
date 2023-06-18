from django.urls import path
from django.views.defaults import page_not_found

from . import views

page_not_found = views.handle_404_error

urlpatterns = [
    path("", views.HomePage.as_view(), name="home_page"),
    path("articles/", views.SearchArticlesPage.as_view(), name="search_articles_page"),
    path("articles/<slug:keyword>", views.ArticlePage.as_view(), name="article_page"),
    path("category/<slug:category_slug>", views.CategoryPage.as_view(), name="category_page"),
    path("confirm/<str:token>", views.ConfirmEmail.as_view(), name="confirm_email"),
    path("author/", views.Authorized.as_view()),
    path("<path:path>", views.Subscriptions.as_view(), name="newsletter_form"),
]
