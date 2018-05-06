$(document).ready(function() {
    var form = $("#form_buying_product");
    var basket_notification = $('.basket-notification');
    (basket_notification.text() === '0') ? basket_notification.hide() : basket_notification.show();

    form.on("submit", function(e) {
        e.preventDefault();
        var nmb = $('#number').val();
        var submit_btn = $('#submit_btn');
        var product_id = submit_btn.data("product_id");

        var data = {};
        data.product_id = product_id;
        data.nmb = nmb;
        var csrf_token = $('#form_buying_product [name="csrfmiddlewaretoken"]').val();
        data["csrfmiddlewaretoken"] = csrf_token;

        var url = form.attr("action");

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
        $('.product-total-price').each(function(){
            total_basket_amount += parseFloat($(this).text());
        });
        $('#total-basket-amount').text(total_basket_amount.toFixed(2));
    }
});