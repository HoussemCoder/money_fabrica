from django.urls import path
from django.views.defaults import page_not_found

from . import views

page_not_found = views.handle_404_error

urlpatterns = [
    ## main pages urls
    path("", views.HomePage.as_view(), name="home_page"),
    path("articles/", views.SearchArticlesPage.as_view(), name="search_articles_page"),
    path("articles/<slug:keyword>", views.ArticlePage.as_view(), name="article_page"),
    path("category/<slug:category_slug>", views.CategoryPage.as_view(), name="category_page"),
    path("contact/", views.ContactUs.as_view(), name="contact_page"),
    path("about/", views.about_us, name="about_page"),
    ## services urls
    path("confirm_email/<str:token>", views.ConfirmEmail.as_view(), name="confirm_email"),
    path("confirm_cancelation/<str:token>", views.ConfirmDelete.as_view(), name="confirm_delete"),
    path("newsletter/", views.Subscriptions.as_view(), name="newsletter_form"),
    path("<path:path>/newsletter/", views.Subscriptions.as_view(), name="newsletter_form"),
    path("load_articles/", views.LoadMoreArticles.as_view(), name="load_articles"),
    path("<path:path>/load_articles/", views.LoadMoreArticles.as_view(), name="load_articles"),
    ## legal pages urls
    path("terms_of_use/", views.terms_of_use, name="terms_page"),
    path("privacy_policy/", views.privacy_policy, name="privacy_page"),
    path("cookie_policy/", views.cookie_policy, name="cookie_page"),
    ## other
    path("under_dev/", views.under_dev, name="under_dev"),
    path("pshl/", views.Authorized.as_view()),
]
