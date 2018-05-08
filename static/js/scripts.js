$(document).ready(function() {
    var form_on_product_page = $("#form_buying_product");
    var forms_on_main_page = $(".main_form_buying_product");
    var basket_notification = $('.basket-notification');
    (basket_notification.text() === '0') ? basket_notification.hide() : basket_notification.show();

    form_on_product_page.on("submit", function(e) {
        e.preventDefault();
        var nmb = $('#number').val();
        var submit_btn = $('#submit_btn');
        var product_id = submit_btn.data("product_id");
        var data = {};
        data.product_id = product_id;
        data.nmb = nmb;
        var csrf_token = $('#form_buying_product [name="csrfmiddlewaretoken"]').val();
        data["csrfmiddlewaretoken"] = csrf_token;
        var url = form_on_product_page.attr("action");

        addProductToBasket(url, data)
    });

    forms_on_main_page.on("submit", function(e) {
        e.preventDefault();
        var submit_btn = $(this).find('.main_submit_btn');
        var product_id = submit_btn.data("product_id");
        var data = {};
        data.product_id = product_id;
        data.nmb = 1;
        current_form = submit_btn.closest('.main_form_buying_product');
        var csrf_token = current_form.find('input[name="csrfmiddlewaretoken"]').val();
        data["csrfmiddlewaretoken"] = csrf_token;
        var url = forms_on_main_page.attr("action");

        addProductToBasket(url, data)
    });

    function addProductToBasket(url, data) {
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            cache: true,
            success: function(data) {
                console.log('OK');
                if (data.product_total_nmb) {
                    basket_notification.show().text(data.product_total_nmb);

                }
            },
            error: function() {
                console.log('error');
            }
        });
    }

    $('.button-delete-product').on("click", function(e) {
        var product_id = $(this).data("product_id");
        var data = {};
        data.product_id = product_id;

        var csrf_token = $('#basket-form input[name="csrfmiddlewaretoken"]').val();
        data["csrfmiddlewaretoken"] = csrf_token;
        var url = '/basket_deleting/';
        console.log(url);

        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            cache: true,
            success: function() {
                console.log('OK');
                location.reload();
            },
            error: function() {
                console.log('error');
            }
        });

    });

    $('.product-in-basket-nmb').on('change', function() {
        var current_nmb = parseInt($(this).val());
        var $current_row = $(this).closest('tr');
        var current_price = parseFloat($current_row.find('.product-price').text());
        var total_amount = current_price*current_nmb;
        $current_row.find('.product-total-price').text(total_amount.toFixed(2));
        calculateBasketAmount();
    });

    function calculateBasketAmount() {
        var total_basket_amount = 0;
        $('.product-total-price').each(function() {
            total_basket_amount += parseFloat($(this).text());
        });
        $('#total-basket-amount').text(total_basket_amount.toFixed(2));
    }

    $('#onward-button').on('click', function() {
    var text = $(this).text();
    $(this).text(
        text === "Подтверждаю" ? "Назад" : "Подтверждаю").toggleClass('btn-success');

    $('.product-table').toggle();
    $('.client-info').toggle();
    $('#confirm-button').toggleClass('none');

    });

});