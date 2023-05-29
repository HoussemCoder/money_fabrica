from django.urls import path

from . import views

urlpatterns = [
    path("home", views.HomeView.as_view(), name="home_page"),
    path("articles", views.HomeArticles.as_view(), name="search_articles_page"),
    path("articles/<slug:keyword>", views.ArticlePage.as_view(), name="article_page"),
    path("category/<slug:category_slug>", views.CategoryPage.as_view(), name="category"),
    path("author", views.Authorized.as_view()),
]
