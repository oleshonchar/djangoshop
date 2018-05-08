from django import forms

class CheckoutContactForm(forms.Form):
    name = forms.CharField(required=True)
    phone = forms.IntegerField(required=True)
    email = forms.EmailField(required=False)
    address = forms.CharField(max_length=256, required=True)
    comment = forms.CharField(max_length=512, required=False)