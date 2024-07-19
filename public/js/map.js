mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates ||[77.10249020, 28.70405920], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});
const marker1 = new mapboxgl.Marker({color:"red"})
        .setLngLat( listing.geometry.coordinates)
        .setPopup( new mapboxgl.Popup({offset:25})
              .setHTML(`<h4>${listing.location}</h4> <p>Exact Location Will be shared after Booking</p>`)
        )
        .addTo(map);

        window.addEventListener('resize', () => {
            map.resize();
            if (window.innerWidth <= 767) {
                map.setZoom(12);
            } else {
                map.setZoom(9);
            }
        });

        map.on('load', () => {
            if (window.innerWidth <= 767) {
                map.setZoom(12);
                map.setCenter(listing.geometry.coordinates);
            }
        });

