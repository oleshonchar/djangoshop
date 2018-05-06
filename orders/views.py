from django.http import JsonResponse
from .models import *
from django.shortcuts import render
from .forms import CheckoutContactForm
from django.contrib.auth.models import User

def basket_adding(request):
    return_dict = dict()
    session_key = request.session.session_key

    data = request.POST
    product_id = data.get('product_id')
    nmb = data.get('nmb')

    new_product, created = ProductInBasket.objects.get_or_create(session_key=session_key, product_id=product_id, defaults={'nmb': nmb})
    if not created:
        new_product.nmb += int(nmb)
        new_product.save(force_update=True)
    product_total_nmb = ProductInBasket.objects.filter(session_key=session_key, is_active=True).count()
    return_dict['product_total_nmb'] = product_total_nmb

    return JsonResponse(return_dict)

def checkout(request):
    session_key = request.session.session_key
    products_in_basket = ProductInBasket.objects.filter(session_key=session_key, is_active=True, order__isnull=True)

    total_basket_amount = 0
    for product_in_basket in products_in_basket:
        total_basket_amount += product_in_basket.total_price

    form = CheckoutContactForm(request.POST or None)
    if request.POST:
        print(request.POST)
        if form.is_valid():
            print('yes')
            data = request.POST
            name = data['name']
            phone = data['phone']
            user, created = User.objects.get_or_create(username=phone, defaults={'first_name': name})

            order = Order.objects.create(user=user, customer_name=name, customer_phone=phone, status_id=1)

            for name, value in data.items():
                if name.startswith('product_in_basket_'):
                    product_in_basket_id = name.split('product_in_basket_')[1]
                    product_in_basket = ProductInBasket.objects.get(id=product_in_basket_id)

                    product_in_basket.nmb = value
                    product_in_basket.order = order
                    product_in_basket.save(force_update=True)

                    ProductInOrder.objects.create(product=product_in_basket.product, nmb=product_in_basket.nmb,
                                                  price_per_item=product_in_basket.price_per_item,
                                                  total_price = product_in_basket.total_price, order=order)

            ProductInBasket.objects.filter(session_key=session_key).delete()

        else:
            print('no')

    return render(request, 'orders/checkout.html', locals())
