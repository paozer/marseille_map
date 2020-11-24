var bounds = [[0,0], [12,19]];
var url = 'maps/original_map.png';

var map = L.map('map', {
    minZoom: 6,
    maxZoom: 8,
    zoom: 7,
    zoomDelta: 0.5,
    zoomSnap: 0.5,
    maxBounds: bounds,
    crs: L.CRS.Simple
});

L.imageOverlay(url, bounds).addTo(map);

for ( var i = 0; i < markers.length; ++i) {
    L.marker([markers[i].lat, markers[i].lng])
        .addTo(map)
        .bindPopup('<p>' + markers[i].text + '</p>' +
            '<img src="' + markers[i].img + '" alt="' + markers[i].alt + '" width="' + markers[i].width+ '" height="' + markers[i].heigth + '">'
            , { maxWidth: "auto", keepInView: "true" })
        .on('click', markerOpenEvent);
}

map.on('popupclose', function(e) { map.setMaxBounds(bounds); });

map.setView([0,10]);

function markerOpenEvent(e)
{
    map.setMaxBounds(null)
    map.setView(e.latlng, 7.5);

    for ( var i = 0; i < markers.length; ++i) {
        if (e.latlng.equals(L.latLng(markers[0].lat, markers[0].lng))) {
            var audio = new Audio(markers[i].audio);
            audio.play();
        }
    }
}
