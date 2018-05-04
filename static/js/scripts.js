$(document).ready(function() {
    var form = $("#form_buying_product");
    var basket_notification = $('.basket-notification');
    (basket_notification.text() === '0') ? basket_notification.hide() : basket_notification.show();

    form.on("submit", function(e) {
        e.preventDefault();
        var nmb = $('#number').val();
        var submit_btn = $('#submit_btn');
        var product_id = submit_btn.data("product_id");
        var product_name = submit_btn.data("product_name");
        var product_price = submit_btn.data("product_price");

        var data = {};
        data.product_id = product_id;
        data.nmb = nmb;
        // data.product_name = product_name;
        // data.product_price = product_price;
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
});