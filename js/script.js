$(function () {
    function formatMoney(value) {
        return value.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function computeGroup(group) {
        const column = $('.table-column-data[data-group="' + group + '"]');
        const qty = parseInt(column.find(".group-qty").val()) || 0;
        let subtotal = 0;
    
        // Regular checked items
        column.find(".item-checkbox:checked").each(function () {
            const price = parseFloat($(this).closest(".item").attr("data-price")) || 0;
            subtotal += price * qty;
        });
    
        // Additional items
        column.find('.item.item-additional').each(function () {
            const price = parseFloat($(this).attr('data-price')) || 0;
    
            if (price > 0) {
                subtotal += price * qty;
            }
        });
    
        const savings = subtotal * 0.10;
        const total = subtotal - savings;
    
        $("#" + group + "-total").val(formatMoney(subtotal));
        $("#" + group + "-discount").val(formatMoney(total));
        $("#subtotal_" + group).text(formatMoney(total));
    
        return {
            subtotal: subtotal,
            savings: savings,
            total: total
        };
    }

    function computeEverything() {
        const principal = computeGroup("principal");
        const bridesmaid = computeGroup("bridesmaid");
        const groomsmen = computeGroup("groomsmen");

        const grandTotal = principal.total + bridesmaid.total + groomsmen.total;
        const totalSavings = principal.savings + bridesmaid.savings + groomsmen.savings;

        const deposit = parseFloat($("#total_deposit").val()) || 0;
        const balance = Math.max(0, grandTotal - deposit);

        $("#total_grand").text(formatMoney(grandTotal));
        $("#total_savings").text(formatMoney(totalSavings));
        $("#total_balance").text(formatMoney(balance));
    }

    function additionalItemText() {
        $(document).on('input', '[name="input_additional_item_1"]', function() {
            var value = $(this).val();    
            $('[name="input_additional_item_1"]').not(this).val(value);
        });
        $(document).on('input', '[name="input_additional_item_2"]', function() {
            var value = $(this).val();    
            $('[name="input_additional_item_2"]').not(this).val(value);
        });
    }
    additionalItemText();

    $(document).on("change", ".item-checkbox", computeEverything); // Checkbox changes
    $(document).on("input", ".group-qty", computeEverything); // Quantity changes
    $("#total_deposit").on("input", computeEverything); // Deposit changes

    computeEverything();


    function additionalItemPrice() {
        $(document).on('input', '.input-additional-price', function() {
            var price = parseFloat($(this).val()) || 0;
            $(this).closest('.item.item-additional').attr('data-price', price);
            computeEverything();
        });
    }
    additionalItemPrice();


    function inputDP() {
        $('#total_deposit')
            .on('focus', function () {
                $(this).val('');
            })
            .on('blur', function () {
                var value = $.trim($(this).val());
    
                if (value === '' || isNaN(value) || parseFloat(value) === 0) {
                    $(this).val('0.00');
                }
            });
    }
    inputDP();


    function clearInputFields() {
        $(document).on('click', 'a.clear', function(e) {
            e.preventDefault();

            // Clear input fields
            $('.client-info .form-group input').val('');

            // Clear additional item names and prices
            $('.input-additional-item, .input-additional-price').val('');

            // Uncheck all selected items
            $('.item-checkbox').prop('checked', false);

            // Clear quantities
            $('.group-qty').val('');

            // Reset deposit
            $('#total_deposit').val('0.00');

            // Recalculate totals
            computeEverything();
        });
    }
    clearInputFields();


    function setBackgroundColor() {
        var oddEvenChecker = $('.table-info .table-column-placeholder .item').length;
        if (oddEvenChecker % 2 !== 0) { // is odd
            $('.table-info .quantity').addClass('mobile-even');
            $('.table-info .summary').addClass('desktop-start-even mobile-start-odd');
        } 
        else { // is even
            $('.table-info .quantity').addClass('mobile-odd');
            $('.table-info .summary').addClass('desktop-start-odd mobile-start-even');
        }
    }
    setBackgroundColor();


    function quantityAutoHeight() {
        var itemCount = $('.table-column-placeholder .item').length;
        var heightAuto = ((itemCount * 40) - 35) + 'px';
        $('.table-column-data .quantity .group-qty').css('height', heightAuto);
    }
    quantityAutoHeight();


    function modalImageOpen() {
        $('.table-column .item:not(:nth-last-child(-n+3)) > span').on('click', function() {
            // Get clicked item index
            var itemImage = $(this).closest('.item').index();
            // Reset previous selection
            $('.modal-body .image-modal').removeClass('image-modal-show');
            // Show modal
            $('.modal').addClass('modal-show');
            // Show matching image
            $('.modal-body .image-modal').eq(itemImage).addClass('image-modal-show');
        });
        $('.modal .close-modal, .modal .modal-background').on('click', function() {
            $('.modal').removeClass('modal-show');
            $('.modal-body .image-modal').removeClass('image-modal-show');
        });
    }
    modalImageOpen();
});