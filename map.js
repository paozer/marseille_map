var bounds = [[0,0], [12,19]];
var url = 'maps/original_map.png';
var audio = new Audio();

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
            '<img src="' + markers[i].img + '" alt="' + markers[i].alt +
            '" width="' + markers[i].width+ '" height="' + markers[i].heigth + '">'
            , { maxWidth: "auto", keepInView: "true" })
        .on('click', markerOpenEvent);
}

map.on('popupclose', markerCloseEvent);
map.setView([0,10]);

function markerOpenEvent(e)
{
    map.setMaxBounds(null)
    map.setView(e.latlng, 7.5);

    for ( var i = 0; i < markers.length; ++i) {
        if (e.latlng.equals(L.latLng(markers[i].lat, markers[i].lng))) {
            audio.src = markers[i].audio;
            audio.play();
        }
    }
}

function markerCloseEvent(e)
{
    audio.pause();
    map.setMaxBounds(bounds);
}
