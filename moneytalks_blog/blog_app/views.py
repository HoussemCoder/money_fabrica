import re
from typing import Any, Dict, Optional
from django.db import models
from django.shortcuts import render
from django.http import Http404
from django.contrib.auth.mixins import LoginRequiredMixin as login
from django.views.generic import TemplateView, ListView, DetailView

from .models import *


H2_PATTERN = re.compile(r"(\d+\.\s(.+)|(\s*Conclusion):)", flags=re.MULTILINE)
H3_PATTERN = re.compile(r"(\s[a-z]\.\n*\s*(.+):)", flags=re.MULTILINE)
P_PATTERN = re.compile(r"(\(*\s*[A-Z].+\.\)*)", flags=re.MULTILINE)

class ArticlePage(DetailView):
    model = Articles
    template_name = 'blog_app/article_template.html'
    context_object_name = 'article'
    slug_url_kwarg = 'keyword'

    def get_object(self):
        return self.kwargs.get(self.slug_url_kwarg)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        keyword = self.get_object()
        article_list = self.model.objects.filter(slug__icontains=keyword)
        if article_list.exists():
            dtl_vars = self.manage_article_content(article_list[0].content)
            related = self.get_related(article_list)
            dtl_vars["related"] = related
            context[self.context_object_name] = article_list[0]
            context.update(dtl_vars)
        else:
            raise Http404("article does not exist")
        return context

    ## function to get the related articles
    def get_related(self, article_list):
        related = []
        try:
            for i in range(1, 7):
                related.append(article_list[i])
        except IndexError:
            related_list = self.model.objects.filter(category=article_list[0].category)
            related_list = [article for article in related_list if article not in article_list]
            rel_num = 7 - len(article_list)
            for related_article in related_list[:rel_num]:
                related.append(related_article)
        return related

    ## function to split the article content and do some inclusions
    def manage_article_content(self, article: str):
        article = H2_PATTERN.sub(r"<h2>\1</h2>", article)
        article = H3_PATTERN.sub(r"<h3>\1</h3>", article)
        article = P_PATTERN.sub(r"<p>\1</p>", article)
        # paragraphs = article.split("\r\n\r\n")
        paragraphs = re.split("\r\n\r\n", article)
        first_para = paragraphs[0]
        mid_para_1 = "".join(paragraphs[1:len(paragraphs)//2])
        mid_para_2 = "".join(paragraphs[len(paragraphs)//2:-1])
        last_para = paragraphs[-1]
        return {
            "first_para": first_para, 
            "mid_para_1": mid_para_1, 
            "mid_para_2": mid_para_2, 
            "last_para": last_para
            }


class HomeView(ListView):
    model = Articles
    template_name = 'blog_app/home.html'

    def get_context_data(self, **kwargs: any):
        context = super().get_context_data(**kwargs)
        mindset_list = self.model.objects.filter(category="Build a Strong Mindset")[:4]
        increase_incomes_list = self.model.objects.filter(category="Increase Your Incomes")[:4]
        dtl_vars = {
            "first_mindset": mindset_list[0],
            "first_increase": increase_incomes_list[0],
            "mindset_articles": mindset_list[1:],
            "incomes_articles": increase_incomes_list[1:]
        }
        context.update(dtl_vars)
        return context

class CategoryPage(DetailView):
    model = Categories
    template_name = "blog_app/category_template.html"
    slug_url_kwarg = "category_slug"

    def get_object(self):
        return self.kwargs.get(self.slug_url_kwarg)

    def get_context_data(self, **kwargs: any):
        context = super().get_context_data(**kwargs)
        category_slug = self.get_object()
        category_data = self.model.objects.filter(slug__icontains=category_slug).first()
        started_articles = Articles.objects.filter(category=category_data.title)[:5]
        dtl_vars = {
            "category": category_data,
            "started_articles": started_articles,
            "popular_articles": self.get_popular()
        }
        context.update(dtl_vars)
        return context

    ## function to get the popular articles
    def get_popular(self):
        popular_list = Articles.objects.order_by("views")[:9]
        return popular_list


class HomeArticles(ListView):
    model = Articles
    template_name = 'blog_app/articles.html'

    def get_context_data(self, **kwargs: any):
        latest_popular = super().get_context_data(**kwargs)
        latest = Articles.objects.order_by("pub_date")[:9]
        popular = Articles.objects.order_by("views")[:9]
        latest_popular["latest"] = latest
        latest_popular["popular"] = popular
        return latest_popular


class Authorized(login, TemplateView):
    template_name = "blog_app/shop.html"
    login_url = "/admin"


def handle_404_error(request, exception):
    return render(request, "404.html", status=404)


