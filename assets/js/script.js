$('body').addClass('loaded');

/*
var wow = new WOW({
    //	boxClass: 'wow', // default
    //	animateClass: 'animated', // default
    //	offset: 0, // default
    mobile: false, // default
    //live: false // default
    //	callback: function (box) {
    //	}
});
wow.init();

*/


setTimeout(function () {
    $('body').addClass('loaded');
}, 4000);


var LoadedMap = false;

function loadMap() {
    if (LoadedMap) return;
    $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAmWmdKbeYcWqCZrLJSoMV6ygZgELvWxmE", function () {
        $.getScript("assets/js/infobox.js", function () {
            $.getScript("assets/js/map.js");
            LoadedMap = true;
        });
    });
}

if ($('.js-map').length > 0) loadMap();


var g = {
    getOs: function () {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        }
        if (/android/i.test(userAgent)) {
            return "Android";
        }
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "iOS";
        }
        return "unknown";
    }
}

var os = g.getOs(),
    eventClick = os == 'iOS' ? 'touchstart' : 'click';


(function () {
    var form = {
        url: 'ajax',
        valid: function (par) {
            var valid = true,
                name = '',
                patternEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            $(par).find("input.required, textarea.required").each(function (i, e) {
                $(e).removeClass("in-error");
                name = $(e).attr('name');
                if (name == 'email' && !patternEmail.test($(e).val())) {
                    if (valid)
                        $(e).focus();
                    $(e).addClass("in-error");
                    valid = false;
                }
                if ($(e).val() == "") {
                    if (valid)
                        $(e).focus();
                    $(e).addClass("in-error");
                    valid = false;
                }
            });
            return valid;
        },

        send: function (that) {
            var formData = new FormData($(that).get(0));
            $(that).addClass('loader');
            var action = $(that).data('action');
            if (action) formData.append('action', action);
            formData.append('pagetitle', $('title').text());
            formData.append('link', location.href);
            $.ajax({
                url: this.url,
                type: "POST",
                data: formData,
                dataType: 'json',
                contentType: false,
                processData: false,
                success: function (data) {
                    console.log(data);
                    txt = '<div class="alert alert-' + data.type + '">' + data.text + '</div>';
                    $(that).find('.btns').before(txt);
                    if (data.type == 'success') {
                        $(that).find('input[type=text], input[type=email]').val('');
                        $(that).find('textarea').val('');
                    }
                    $(that).removeClass('loader');
                    var time = 5000;
                    if (data.url) time = 3000;

                    setTimeout(function () {
                        $.fancybox.close();
                        if (data.url) {
                            location.href = data.url;
                        }
                        $('.alert').remove();
                    }, time);
                }
            });

        }
    }

    // mob mav
    $(document).on(eventClick, '.js-open-nav', function () {
        $('.mob-nav').addClass('active');
        $('body').append('<div class="mask-site"></div>');
        setTimeout(function () {
            $('body').addClass('o-hide');
        }, 10);
    });

    $(document).on(eventClick, '.mask-site, .close-modal', function () {
        $('.mob-nav').removeClass('active');
        $('.mask-site').remove();
        setTimeout(function () {
            $('body').removeClass('o-hide');
        }, 100);

    });


    $(document).on('submit', '.js-form', function (e) {
        e.preventDefault();
        if (form.valid(this)) {
            form.send(this);
        }
    });


    if ($('a[href="#"]').length > 0) {
        $(document).on('click', 'a[href="#"]', function (e) {
            e.preventDefault();
        })
    }

    /*
    $('.slider').owlCarousel({
        loop: true,
        margin: 0,
        nav: true,
        dots: false,
        items: 1,
        center: true,
        //  autoplay: true,
        smartSpeed: 900,
        autoplaySpeed: 900,
        autoplayTimeout: 6000,
        navText: ['', ''],
        responsiveClass: true,
    });
    */

   $('input[name=phone], .js-mask-phone').mask('+0 000 000 00 009', {
        clearIfNotMatch: true
    });



    $(document).on(eventClick, '.tab-nav a', function (e) {
        e.preventDefault();
        var id = $(this).attr('href');
        $('.tab-nav a').removeClass('active');
        $(this).addClass('active');
        $('.tab-content').removeClass('active');
        $(id).addClass('active');
    });

    $(document).on(eventClick, '.js-copy-phone', function () {
        // console.log($(this).parent().find('.form-group ').length);
        if ($(this).parent().find('.form-group').length == 2) {
            $(this).hide();
        }
        $(this).before($('.js-copy-phone').prev().clone());
        $('.js-copy-phone').prev().find('input').val('').mask('+0 000 000 00 009', {
            clearIfNotMatch: true
        });
        $('.js-copy-phone').prev().find('.star').remove();
    });


    function setSelect() {
        var id = $('.easy-autocomplete-container .selected .wr-res').data('id');
        console.log(id);
        $.fancybox.open({
            src  : 'ajax?action=person&id=' + id,
            type : 'ajax',
            opts : {
                onComplete : function() {
                }
            }
        });
    };

    var options = {
        url: function (phrase) {
            return "assets/components/msearch2/action.php";
        },

        getValue: function (element) {
            // console.log(element);
            return element.name;
        },

        listLocation: "results",
        getValue: "value",

        ajaxSettings: {
            dataType: "json",
            method: "POST",
            data: {
                action: 'search',
                pageId: 1,
                key: "e14e72df2ca480feeee6422591a91566be4a7de5"
            }
        },

        preparePostData: function (data) {
            data.query = $('.js-autocomplete').val();
            if (!data.query) {
                //  return false;
            }
          //  console.log();
            return data;
        },
        list: {
            onClickEvent: function (e) {
                // console.log(options);
                setSelect();
            },
            onKeyEnterEvent: function (e) {
                setSelect();
            }
        },
        template: {
            type: "custom",
            method: function (value, item) {
                return '<span class="wr-res" data-id="' + item.id + '">' + value + " | " + item.phone + '</span>';
            }
        },
        requestDelay: 400
    };

    $('.js-autocomplete').easyAutocomplete(options);


    $(document).on('change', '.js-radio-list input', function () {
        var val = $(this).val();
        $('.type_res').hide();
        $('.js-' + val).show();
    });


    $(document).on('submit', '.seach-form', function(e){
        e.preventDefault();
        var $el = $('.page-content > .container'),
            url = "?action=search&query="+ $('.seach-form input[name=query]').val();
        $el.addClass('loader');
        $.get( 'ajax'+url, function( data ) {
           // console.log(data);
            $el.html( data );
            $el.removeClass('loader');
            history.pushState(null, null, 'search'+url);
        });
    });


})();