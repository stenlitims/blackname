(function ($) {
    var map,
        dataMap = null;

    var mapOptions = {
        zoom: 16,
        center: new google.maps.LatLng(50.3699189,30.3884391),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false,
        mapTypeControl: false,
        scaleControl: false,
        //styles: styles,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
    }
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);


    var InfoBoxs = [],
        markers = [],
        data = [{
            adress: 'Orange',
            gps: '50.3699189,30.3884391',
            pin: 'location',
        }
    ];


    //   $.getJSON('ajax?action=getLoc', function (d) {

    $.each(data, function (index) {
        var cord = this.gps.split(',');
        var pin = 'assets/images/icons/star.png',
            zIndex = 0;

        var pixelOffset = new google.maps.Size(0, -75);

        if (this.pin) pin = 'assets/images/' + this.pin + '.png';


        markers[index] = new google.maps.Marker({
            position: {
                lat: +cord[0],
                lng: +cord[1]
            },
            map: map,
            title: this['adress'],
            MIGX_id: index,
            icon: {
                url: pin,
            },
            zIndex: zIndex
        });


        InfoBoxs[index] = new InfoBox({
            content: '<div class="infobox-wrapper"><div class="title">' + this.adress + '</div></div>',
            alignBottom: true,
            pixelOffset: pixelOffset,
            pane: "floatPane",
            zIndex: 999,
        });

        /*
        google.maps.event.addListener(markers[index], 'click', function (i) {
            markers.forEach(function (item, i) {
                InfoBoxs[i].close();
            });
            InfoBoxs[index].open(map, markers[index]);
        });
        */


        google.maps.event.addListener(markers[index], 'mouseover', function (i) {
            InfoBoxs[index].open(map, markers[index]);

        });

        google.maps.event.addListener(markers[index], 'mouseout', function (i) {
            InfoBoxs[index].close(map, markers[index]);
        });
    });


    //  });


})(jQuery);