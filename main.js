// Creation de la MAP de base
// const map = L.map('map').setView([48.833, 2.333], 7);
const map = L.map('map').setView([48.833, 2.333], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 30,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// Récupération des élements html
var modal = document.querySelector('#laModale');
var inputTitre = document.querySelector('#titre');
var inputAdresse = document.querySelector('#adresse');
var inputSite = document.querySelector('#site');
var inputDescription = document.querySelector('#description');
var vegan = document.querySelector('input[id="resto-vegan"]');
var sansGluten = document.querySelector('input[id="resto-sansgluten"]');
var sansLactose = document.querySelector('input[id="resto-sanslactose"]');
var coordonnée
var inputImage = document.querySelector('#image');
var preview = document.querySelector('#preview');

var tableauMarker = [];

try {
      // on essaye de récupérer le tableau dans le localstorage
  var storageData = localStorage.getItem('savetableauMarker_v2');
  if (storageData) {
    tableauMarker = JSON.parse(storageData);
  }
} catch (error) {
      // si ça ne fonctionne pas, on crée un tableau vide
  console.error('Erreur lors de la récupération des données du localstorage :', error);
}

// var tableauMarker
// try {
//     // on essaye de récupérer le tableau dans le localstorage
//     tableauMarker = JSON.parse(localStorage.getItem('savetableauMarker')) || [];
// }
// catch (error) {
//     // si ça ne fonctionne pas, on crée un tableau vide
//     tableauMarker = [];
//     // et on ne fait rien avec l'erreur
// }

function onMapClick(e) {
    coordonnée= e.latlng;
    modal.showModal();
}
map.on('click', onMapClick);

modal.addEventListener('close', function () {
    console.log(modal.returnValue)
    if (modal.returnValue === 'oui') {
        tableauMarker.push({
            titre: inputTitre.value,
            adresse: inputAdresse.value,
            site: inputSite.value,
            description: inputDescription.value,
            coordonnée,
            vegan:vegan.checked,
            sansLactose: sansLactose.checked,
            sansGluten: sansGluten.checked,
            image: preview.src
        });
        localStorage.setItem('savetableauMarker_v2', JSON.stringify(tableauMarker));
        ajoutMarkerSurLaMap(
            inputTitre.value, 
            inputAdresse.value, 
            inputSite.value, 
            inputDescription.value,
            coordonnée,
            vegan.checked, 
            sansGluten.checked,
            sansLactose.checked,
            preview.src
            );
    }
});


// on charge les marqueurs du localstorage
for (var i = 0; i < tableauMarker.length; i++) {
    ajoutMarkerSurLaMap(tableauMarker[i].titre, 
        tableauMarker[i].adresse,
         tableauMarker[i].site, 
         tableauMarker[i].description,  
         tableauMarker[i].coordonnée,
         tableauMarker[i].vegan,
         tableauMarker[i].sansGluten,
         tableauMarker[i].sansLactose,
         tableauMarker[i].image);
}


function ajoutMarkerSurLaMap(titre, adresse, site, description, coordonnée, veganChecked, sansGlutenChecked, sansLactoseChecked,image) {
    var monIcone;
    if (veganChecked) {
        monIcone = 'img/vegan-marker.png';
    } else if (sansGlutenChecked) {
        monIcone = 'img/sans-gluten-marker.png';
    } else if (sansLactoseChecked) {
        monIcone = 'img/sans-lactose-marker.png';
    }
    // Création d'une icône personnalisée
    var myIcon = L.icon({
        iconUrl: monIcone,
        iconSize: [30, 45], // taille de l'icône
        iconAnchor: [12, 41], // position de l'ancre de l'icône
        popupAnchor: [0, -41] // position de l'ancre de la popup
    });
    var marker = new L.Marker([coordonnée.lat, coordonnée.lng], {icon: myIcon}).addTo(map);
    marker.bindPopup(
        '<h2>' + titre + '</h2>'
        + '<p>' + adresse + '</p>'
        + '<p>' + site + '</p>'
        + '<p>' + description + '</p>'
        + '<p><img src="' + image + '" style="max-width: 150px;"></p>'
        + '<p><a style="cursor: pointer" onclick="supprimeMarker('+ coordonnée.lat + ', ' + coordonnée.lng + ')">Supprimer</a></p>'
    );
}


function supprimeMarker(lat, lng) {
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            if (layer.getLatLng().lat === lat && layer.getLatLng().lng === lng) {
                map.removeLayer(layer);
            }
        }
    });


    tableauMarker = tableauMarker.filter(function (marker) {
        return marker.coordonnée.lat !== lat || marker.coordonnée.lng !== lng;
    });
    localStorage.setItem('savetableauMarker_v2', JSON.stringify(tableauMarker));
}

inputImage.addEventListener('change', function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
  
    reader.onload = function(event) {
      preview.src = event.target.result;
    };
  
    reader.readAsDataURL(file);
  });


var btnvegan = document.querySelector('#vegan');
var btnsansgluten = document.querySelector('#sans-gluten');
var btnsanslactose = document.querySelector('#sans-lactose');
var btnaffichertous = document.querySelector('#afficher');

btnvegan.addEventListener('click', function () {
    console.log("ICI")
    // suppression des marqueurs existants sur la carte
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    for (var i = 0; i < tableauMarker.length; i++) {
        if (tableauMarker[i].vegan) {
            var marker = tableauMarker[i];
            {
                ajoutMarkerSurLaMap(
                    marker.titre,
                    marker.adresse,
                    marker.site,
                    marker.description,
                    marker.coordonnée,
                    marker.vegan,
                    marker.sansGluten,
                    marker.sansLactose,
                    marker.image
                );
            }
        }
    }
});

btnsansgluten.addEventListener('click', function () {
    console.log("ICI")
    // suppression des marqueurs existants sur la carte
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    for (var i = 0; i < tableauMarker.length; i++) {
        if (tableauMarker[i].sansGluten) {
            var marker = tableauMarker[i];
            {
                ajoutMarkerSurLaMap(
                    marker.titre,
                    marker.adresse,
                    marker.site,
                    marker.description,
                    marker.coordonnée,
                    marker.vegan,
                    marker.sansGluten,
                    marker.sansLactose,
                    marker.image
                );
            }
        }
    }
});

btnsanslactose.addEventListener('click', function () {
    console.log("ICI")
    // suppression des marqueurs existants sur la carte
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    for (var i = 0; i < tableauMarker.length; i++) {
        if (tableauMarker[i].sansLactose) {
            var marker = tableauMarker[i];
            {
                ajoutMarkerSurLaMap(
                    marker.titre,
                    marker.adresse,
                    marker.site,
                    marker.description,
                    marker.coordonnée,
                    marker.vegan,
                    marker.sansGluten,
                    marker.sansLactose,
                    marker.image
                );
            }
        }

    }
});


btnaffichertous.addEventListener('click', function () {
    // suppression des marqueurs existants sur la carte
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    for (var i = 0; i < tableauMarker.length; i++) {
        var marker = tableauMarker[i];
        {
            ajoutMarkerSurLaMap(
                marker.titre,
                marker.adresse,
                marker.site,
                marker.description,
                marker.coordonnée,
                marker.vegan,
                marker.sansGluten,
                marker.sansLactose,
                marker.image
            );
        }
    }
});
