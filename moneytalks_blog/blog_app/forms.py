from django import forms


class SearchForm(forms.Form):
    search = forms.CharField(
        max_length=300,
        widget=forms.TextInput(attrs={"placeholder": "Search Articles"}),
        required=False
    )
    category = forms.ChoiceField(
        widget=forms.Select(attrs={"class": "search-btn button filter-btn", "id": "categories"}),
        choices=[
        ("All Categories", "All Categories"),
        ("Build a Strong Mindset", "Build Mindset"),
        ("Increase Your Incomes", "Increase Incomes"),
        ("Develop New Skills", "Develop Skills"),
        ("Get Remote Jobs", "Remote Jobs"),
        ("Start a Business", "Start Business")
    ])
    filter = forms.ChoiceField(
        widget=forms.Select(attrs={"class": "search-btn button filter-btn", "id": "filter"}),
        choices=[
        ("newest", "Newest"),
        ("popular", "Popular")
    ])


class Newsletter(forms.Form):
    email = forms.EmailField(
        max_length=300,
        widget=forms.EmailInput(attrs={"class": "email-input", "placeholder": "Enter your email address"})
        )


class ResendEmail(forms.Form):
    hidden_data = forms.CharField(
        widget=forms.HiddenInput(attrs={"name": "email", "value": "{{email}}"})
        )
    form_type = forms.CharField(
        widget=forms.HiddenInput(attrs={"name": "form_type", "value": "resend_email"})
        )