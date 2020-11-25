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
            '<img src="' + markers[i].img + '" alt="' + markers[i].alt +
            '" width="' + markers[i].width+ '" height="' + markers[i].heigth + '">'
            , { maxWidth: "auto", keepInView: "true" }) //keepInView may produce bug of flyback after overeaching popup
        .on('click', markerOpenEvent);
}

map.on('popupclose', markerCloseEvent);
map.setView([0,10]);

// bigup to ghybs on so
document.querySelector(".leaflet-popup-pane").addEventListener("load",
    function (event) {
        var tagName = event.target.tagName;
        var popup = map._popup;

        if (tagName === "IMG" && popup && !popup._updated) {
            popup.update();
            popup._updated = true;
        }
    },
    true
);

var prev_bounds;
var audio = new Audio();

function markerOpenEvent(e)
{
    prev_bounds = map.getBounds();
    map.setMaxBounds(null);
    map.flyTo(e.latlng, Math.max(map.getZoom(), 7.5));

    for ( var i = 0; i < markers.length; ++i) {
        if (e.latlng.equals(L.latLng(markers[i].lat, markers[i].lng))) {
            audio.src = markers[i].audio;
            audio.play();
        }
    }
}

function markerCloseEvent(e)
{
    map.setMaxBounds(bounds);
    map.flyToBounds(prev_bounds);
    audio.pause();
}
