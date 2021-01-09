var bounds = [[0,0], [12,19]];
var url = 'maps/original_map.png';

var pinIcon = L.icon({
    iconUrl: 'images/marker_icon.png',
    iconSize:     [30, 33],
    iconAnchor:   [7, 33],
    popupAnchor:  [0, -33]
});

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

for ( var i = 0; i < markers.length; ++i ) {
    L.marker([markers[i].lat, markers[i].lng], { icon: pinIcon }).addTo(map)
        .bindPopup(
            '<center><p><b>' + markers[i].title + '</b></p></center>' +
            '<a href="' + markers[i].img_src + '" target="_blank" rel="noopener noreferrer">' +
            '<img src="' + markers[i].img + '"' + '>' +
            '</a>'
            , { maxWidth: "auto", keepInView: "true" })
        .on('click', markerOpenEvent);
}

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

map.on('popupclose', markerCloseEvent);
map.setView([0,10]);

var prev_bounds;
var audio = new Audio();

function markerOpenEvent(e)
{
    prev_bounds = map.getBounds();
    map.setMaxBounds(null);
    map.flyTo(e.latlng, Math.max(map.getZoom(), 7.5));

    for ( var i = 0; i < markers.length; ++i ) {
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
