import re, string, secrets
from datetime import datetime, timedelta
from typing import Any
from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import Http404, HttpRequest, HttpResponse, JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin as login
from django.views.generic import TemplateView, ListView, DetailView
from django.views.generic.edit import FormView
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.conf import settings

from .forms import *
from .models import *


class HomePage(ListView):
    template_name = 'blog_app/home.html'
    model = Articles
    search_form = SearchForm()
    email_form = Newsletter()

    def get_context_data(self, **kwargs: Any):
        context = super().get_context_data(**kwargs)
        mindset_list = self.model.objects.filter(category="Build a Strong Mindset").order_by("views")[:4]
        increase_incomes_list = self.model.objects.filter(category="Increase Your Incomes").order_by("views")[:4]
        dtl_vars = {
            "search_form": self.search_form,
            "email_form": self.email_form,
            "first_mindset": mindset_list[0],
            "first_increase": increase_incomes_list[0],
            "mindset_articles": mindset_list[1:],
            "incomes_articles": increase_incomes_list[1:],
            "latest_articles": self.get_latest()
        }
        context.update(dtl_vars)
        return context
    
    ## function to get the popular articles
    def get_latest(self):
        popular_list = Articles.objects.order_by("pub_date")[:9]
        return popular_list


class CategoryPage(DetailView):
    model = Categories
    template_name = "blog_app/category_template.html"
    slug_url_kwarg = "category_slug"
    search_form = SearchForm()
    email_form = Newsletter()

    def get_object(self):
        return self.kwargs.get(self.slug_url_kwarg)

    def get_context_data(self, **kwargs: Any):
        context = super().get_context_data(**kwargs)
        category_slug = self.get_object()
        category_data = self.model.objects.filter(slug__icontains=category_slug).first()
        started_articles = Articles.objects.filter(category=category_data.title)[:5]
        dtl_vars = {
            "category": category_data,
            "started_articles": started_articles,
            "popular_articles": self.get_popular(),
            "search_form": self.search_form,
            "email_form": self.email_form
        }
        context.update(dtl_vars)
        return context

    ## function to get the popular articles
    def get_popular(self):
        popular_list = Articles.objects.order_by("views")[:9]
        return popular_list


class SearchArticlesPage(FormView):
    template_name = "blog_app/articles.html"
    form_class = SearchForm
    email_form = Newsletter()

    def get(self, request: HttpRequest, *args: str, **kwargs: Any) -> HttpResponse:
        keyword = self.request.GET.get("search", "")
        category_selected = self.request.GET.get("category", "All Categories")
        filter_selected = self.request.GET.get("filter", "popular")
        if "search" in self.request.GET:
            try:
                results = self.get_result_articles(keyword, filter_selected, category_selected)
                return self.render_to_response(self.get_context_data(
                    results=results,
                    keyword=keyword,
                    count=len(results),
                    category=category_selected
                    ))
            except Articles.DoesNotExist as e:
                return handle_404_error(request, e)
        return self.render_to_response(self.get_context_data())

    def get_result_articles(self, keyword: str, filter_selected: str, category_selected: str):
        filter_selected = "views" if filter_selected == "popular" else "pub_date"
        if category_selected == "All Categories":
            results = Articles.objects.filter(title__icontains=keyword).order_by(filter_selected)
        else:
            results = Articles.objects.filter(title__icontains=keyword, category=category_selected).order_by(filter_selected)
        return results

    def get_latest_popular_articles(self):
        latest = Articles.objects.order_by("pub_date")[:9]
        popular = Articles.objects.order_by("views")[:9]
        latest_popular = {"latest": latest, "popular": popular}
        return latest_popular

    def get_context_data(self, **kwargs: Any):
        context = super().get_context_data(**kwargs)
        context["search_form"] = context["form"]
        context["email_form"] = self.email_form
        context.update(self.get_latest_popular_articles())
        return context


## regex patterns for capturing the article headings and paragraphs
H2_PATTERN = re.compile(r"(\d+\.\s(.+)|(\s*Conclusion):)", flags=re.MULTILINE)
H3_PATTERN = re.compile(r"(\s[a-z]\.\n*\s*(.+):)", flags=re.MULTILINE)
P_PATTERN = re.compile(r"(\(*\s*[A-Z].+\.\)*)", flags=re.MULTILINE)
# EMAIL_PATTERN = re.compile(r"^[\w\.-]+@[\w\.-]+\.\w+$")
# def is_valid_email(self, email: str):
#     return re.fullmatch(EMAIL_PATTERN, email) is not None


class ArticlePage(DetailView):
    model = Articles
    template_name = 'blog_app/article_template.html'
    context_object_name = 'article'
    slug_url_kwarg = 'keyword'
    search_form = SearchForm()
    email_form = Newsletter()

    def get_object(self):
        return self.kwargs.get(self.slug_url_kwarg)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["search_form"] = self.search_form
        context["email_form"] = self.email_form
        keyword = self.get_object()
        article_list = self.model.objects.filter(slug__icontains=keyword)
        if article_list.exists():
            article = self.define_html_tags(article_list[0].content)
            dtl_vars = self.split_article_content(article)
            related = self.get_related(article_list)
            context["category_url"] = self.get_category_slug(article_list[0])
            context["related"] = related
            context[self.context_object_name] = article_list[0]
            context.update(dtl_vars)
        else:
            raise Http404("article does not exist")
        return context

    def get_category_slug(self, article):
        return Categories.objects.get(title=article.category).slug

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

    ## function to split the article content
    def split_article_content(self, article: str):
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

    ## function to add headings and other html tags
    def define_html_tags(self, article: str):
        article = H2_PATTERN.sub(r"<h2>\1</h2>", article)
        article = H3_PATTERN.sub(r"<h3>\1</h3>", article)
        article = P_PATTERN.sub(r"<p>\1</p>", article)
        return article


class ContactUs(FormView):
    template_name = "blog_app/contact.html"
    form_class = ContactForm
    search_form = SearchForm()
    email_form = Newsletter()

    def form_valid(self, form: Any):
        name = form.cleaned_data["name"]
        email = form.cleaned_data["email"]
        subject = form.cleaned_data["subject"]
        text = form.cleaned_data["text"]
        try:
            self.send_contact_email(name, email, subject, text)
        except:
            pass
        if not self.check_if_exists(name, email, subject, text):
            self.save_contact_data(name, email, subject, text)
        response_data = {"success": True}
        return JsonResponse(response_data)

    def form_invalid(self, form: Any):
        if "email" in form.errors:
            error = form.errors["email"]
            email_status = True
        else:
            error = "An error occurred during form submission. Please try again."
            email_status = False
        response_data = {
            "success": False,
            "email_error": email_status,
            "message": error
        }
        return JsonResponse(response_data)

    def get_context_data(self, **kwargs: Any):
        context = super().get_context_data(**kwargs)
        context["contact_form"] = self.form_class
        context["search_form"] = self.search_form
        context["email_form"] = self.email_form
        return context

    def send_contact_email(self, name, sender, subject, text):
        message = f"{text} ___From: {name}"
        email = EmailMessage(
            subject=subject,
            body=message,
            from_email=sender,
            to=[settings.DEFAULT_FROM_EMAIL]
        )
        return email.send()
    
    def save_contact_data(self, name, email, subject, text):
        new_contact = ContactsHistory(
            name=name,
            email=email,
            subject=subject,
            message=text,
            checked=False
        )
        new_contact.save()

    def check_if_exists(self, name, email, subject, text):
        matched_record = ContactsHistory.objects.filter(name=name, email=email, subject=subject, message=text)
        if matched_record.exists():
            return True
        return False

class Subscriptions(FormView):
    template_name = "base.html"
    
    def get_form_class(self):
        if self.request.POST.get("form_type") == "resend_email":
            return ResendEmail
        return Newsletter

    def form_valid(self, form: Any):
        email = form.cleaned_data["email"]
        try:
            validate_email(email)
        except ValidationError:
            response_data = {
                "success": False,
                "message": "Your email address entered is not valid. Please try again."
            }
            return JsonResponse(response_data)
        if self.check_email_existence(email):
            response_data = {
                "success": False,
                "message": "This email is already exist in our database, do you want to cancel your subscription?",
                "exist": True
            }
            decision = form.cleaned_data["delete"]
            if decision == "yes":
                confirmation_code = self.generate_confirmation_code()
                try:
                    self.send_confirmation_delete(email, confirmation_code)
                except:
                    response_data = {
                        "success": False,
                        "message": "An error occurred during form submission. Please try again."
                    }
                    return JsonResponse(response_data)
                expiration = self.generate_expiration_time()
                email_db = UsersEmails.objects.get(email=email)
                email_db.confirmation_delete = confirmation_code
                email_db.expiration_time = expiration
                email_db.save()
                response_data["message"] = f"{email[:3]}********"
                response_data["delete"] = True
                return JsonResponse(response_data)
            elif decision == "no":
                response_data["delete"] = False
                return JsonResponse(response_data)
            else:
                return JsonResponse(response_data)
        confirmation_code = self.generate_confirmation_code()
        try:
            self.send_confirmation_email(email, confirmation_code)
        except:
            response_data = {
                "success": False,
                "message": "An error occurred during form submission. Please try again."
            }
            return JsonResponse(response_data)
        expiration = self.generate_expiration_time()
        self.save_data(email, confirmation_code, expiration)
        response_data = {
            "success": True,
            "message": f"{email[:3]}********"
        }
        return JsonResponse(response_data)

    def form_invalid(self, form: Any):
        errors = form.errors
        response_data = {
            "success": False,
            "message": errors["email"]
        }
        return JsonResponse(response_data)

    def save_data(self, email, code, expiration):
        new_email = UsersEmails(email=email, confirmation_code=code, expiration_time=expiration)
        new_email.save()

    def check_email_existence(self, email: str):
        try:
            UsersEmails.objects.get(email=email)
            return True
        except UsersEmails.DoesNotExist:
            return False

    def send_confirmation_email(self, send_to: str, code: str):
        subject = "Confirm Your Subscription | Money Talks"
        template = "emails/confirmation_email.html"
        context = {
            "confirmation_url": code,
            "base_url": settings.BASE_URL
            }
        email_message = render_to_string(template, context)
        email = EmailMessage(
            subject=subject,
            body=email_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[send_to]
        )
        return email.send()

    def send_confirmation_delete(self, send_to: str, code: str):
        subject = "Confirm Your Cancelation | Money Talks"
        template = "emails/confirmation_delete.html"
        context = {
            "delete_url": code,
            "base_url": settings.BASE_URL
        }
        email_message = render_to_string(template, context)
        email = EmailMessage(
            subject=subject,
            body=email_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[send_to]
        )
        return email.send()

    def generate_confirmation_code(self, length=20):
        characters = string.ascii_letters + string.digits
        code = "".join(secrets.choice(characters) for _ in range(length))
        similar = UsersEmails.objects.filter(confirmation_code=code)
        while similar:
            code = "".join(secrets.choice(characters) for _ in range(length))
            similar = UsersEmails.objects.filter(confirmation_code=code)
        return code

    def generate_expiration_time(self):
        expiration_time = datetime.now() + timedelta(hours=20)
        return expiration_time


class ConfirmEmail(DetailView):
    template_name = "confirmation_url.html"
    slug_url_kwarg = "token"
    model = UsersEmails
    search_form = SearchForm()
    resend_form = ResendEmail()
    object = None

    def get(self, request, *args: Any, **kwargs: Any):
        token = self.kwargs.get(self.slug_url_kwarg)
        email = self.model.objects.get(confirmation_code=token)
        if not email:
            return render(self.request, self.template_name, self.get_context_data(no_email=True))
        now = datetime.now()
        expiration_time = datetime.strptime(email.expiration_time, "%Y-%m-%d %H:%M:%S.%f")
        if expiration_time < now:
            self.delete_old_email(email)
            return render(self.request, self.template_name, self.get_context_data(expired=True, email=email.email))
        else:
            self.confirmed_email(email)
            success_url = reverse("home_page") + "?confirmed=true"
            return redirect(success_url)
    
    def confirmed_email(self, email):
        email.is_valid = True
        email.save()

    def delete_old_email(self, email):
        try:
            email.delete()
        except self.model.DoesNotExist:
            pass

    def get_context_data(self, **kwargs: Any):
        context = super().get_context_data(**kwargs)
        context["search_form"] = self.search_form
        context["resend_form"] = self.resend_form
        return context


class Authorized(login, TemplateView):
    login_url = "/pshl/"
    

def under_dev(request):
    search_form = SearchForm()
    email_form = Newsletter()
    context = {
        "search_form": search_form,
        "email_form": email_form
        }
    return render(request, "blog_app/under_development.html", context)


def handle_404_error(request, exception):
    view = SearchArticlesPage()
    view.request = request
    context = view.get_context_data()
    return render(request, "404.html", context, status=404)


