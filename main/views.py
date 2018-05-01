from django.shortcuts import render
from products.models import *

def main(request):
    products_images = ProductImage.objects.filter(is_active=True, is_main=True)
    return render(request, 'main/main_page.html', locals())