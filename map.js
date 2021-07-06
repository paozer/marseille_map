var bounds = [[0,0], [12,19]];
var url = 'maps/original_map.jpg';

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
    crs: L.CRS.Simple,
    tap: false // fixes safari double event bug on popup open
});

L.imageOverlay(url, bounds).addTo(map);

for ( var i = 0; i < markers.length; ++i ) {
    L.marker([markers[i].lat, markers[i].lng], { icon: pinIcon }).addTo(map)
        .bindPopup(
            '<center><p><b>' + markers[i].title + '</b></p></center>' +
            '<div id="'+ markers[i].name +'">' +
            '<button onclick="switchPopupContent(\'' + markers[i].name + '\', \'text\')">Mitlesen</button>' +
            '<p><a href="' + markers[i].img_src + '" target="_blank" rel="noopener noreferrer">' + '<img src="' + markers[i].img + '"' + '>' + '</a></p>' +
            '</div>'
            , { maxWidth: 500, maxHeight: 700, autoPan: "false", keepInView: "false" })
        .on('click', markerOpenEvent);
}

function switchPopupContent(marker, image_or_text)
{
    div = document.getElementById(marker);
    for ( var i = 0; i < markers.length; ++i ) {
        if (marker === markers[i].name && image_or_text === "text") {
            div.innerHTML = '<button onclick="switchPopupContent(\'' + markers[i].name + '\', \'image\')">Mitgucken</button>' +  '<p>' + markers[i].text + '<\p>';
        }
        else if (marker === markers[i].name && image_or_text === "image") {
            div.innerHTML = '<button onclick="switchPopupContent(\'' + markers[i].name + '\', \'text\')">Mitlesen</button>' + '<p><a href="' + markers[i].img_src + '" target="_blank" rel="noopener noreferrer">' + '<img src="' + markers[i].img + '"' + '>' + '</a></p>';
        }
    }
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

alert("Anmerkungen:\n\nDie Photographien dienen der Veranschaulichung der erwähnten Orte und sind - durch fehlende Quellen - nicht immer an die exakten Orten des Geschehens in Anna Seghers Roman Transit gebunden. Des Weiteren sind zeitliche Variationen bzw. nicht genau feststellbare Daten der Aufnahmen möglich.\n\nDiese Karte wurde als Anhang einer Studienleistung über „die Bedeutung der Stadt Marseilles im Roman Transit von Anna Seghers“ im Rahmen eines von Prof. Dr. Claudia Albert (FU Berlin) geleiteten Seminars: „Sprache und Exil“ im Sommersemester 2019 an der Freien Universität Berlin erstellt und war nicht Bestandteil der Prüfung. Diese Karte dient der Veranschaulichung des Lebens des Protagonisten im Roman Transit von Anna Seghers. Sie sollte als Ergänzung bzw. Veranschaulichung des im Roman beschriebenen Marseilles verstanden werden, nicht als eigenständiges Objekt.\n\nPrimärtext: Anna Seghers, Transit, Aufbau Verlag, Berlin (2018)\n\nMitwirkende:\nIdee, Konzeption und Recherche : Lucie David (Freie Universität Berlin)\nProgrammierung: Paolo Ramella-Ratin (42 Lyon, Karlsruher Institut für Technologie), Lucie David\nStimme: Louise Otterbein (Freie Universität Berlin)");

var prev_bounds;
var audio = new Audio();

function markerOpenEvent(e)
{
    prev_bounds = map.getBounds();
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
    map.flyToBounds(prev_bounds);
    audio.pause();
}
