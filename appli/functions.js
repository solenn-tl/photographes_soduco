function createlinkDataSoduco(uri){

    var query2 = "PREFIX owl: <http://www.w3.org/2002/07/owl#>" +
      "PREFIX adb: <http://data.soduco.fr/def/annuaire#>"+
      "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"+
      "PREFIX gsp: <http://www.opengis.net/ont/geosparql#>"+
      "select distinct * where { <http://data.soduco.fr/id/entry/" + uri + "> owl:sameAs ?s." +
      " ?s a adb:Entry;" +
      " rdfs:label ?person ;" +
      " adb:numEntry ?index ;" +
      " adb:activity ?activity ;" +
      " adb:address ?address ;" +
      " adb:directoryDate ?directoryDate ;" +
      " adb:directoryName ?directoryName ." +
      "} group by ?s ?index ?person ?activity ?address ?directoryDate ?directoryName order by ?directoryDate"
  
    var queryURL2 = repertoireGraphDB + "?query="+encodeURIComponent(query2)+"&?application/json";
    
    $.ajax({
      url: queryURL2,
      Accept: "application/sparql-results+json",
      contentType:"application/sparql-results+json",
      dataType:"json",
      data:''
    }).done((promise) => {
      //Create Timeline JS JSON
      //Init geojson
      var timelinejson = {"title": {"text":{"headline":'Données liées'}}, "events": []}
      //INIT TimelineJson END
  
      //Iter on features
      $.each(promise.results.bindings, function(i,bindings){
    
        //Init feature
        var feature = {
          "start_date": {
                "year":bindings.directoryDate.value,
                "month":"1",
                "day":"1",
                "display_date":"Année"
            },
          "end_date": {
                "year":bindings.directoryDate.value,
                "month":"12",
                "day":"31",
                "display_date":bindings.directoryDate.value,
            },
          "text": {
            "headline": bindings.person.value,
            "text": '<p>' + bindings.activity.value + '</br>' + bindings.address.value + '<br/>Source : ' + bindings.directoryName.value + ' - ' + bindings.index.value + "<br/>Nombre d'entités liées : " + promise.results.bindings.length.toString() + '</p>'
          },
          "group":bindings.address.value,
          "background":{"color":"#1c244b"},
          "unique_id":uri
          }
        //console.log(feature)
        timelinejson.events.push(feature);
        });

    var options = {
        scale_factor:1,
        language:'fr',
        start_at_slide:1,
        hash_bookmark: false,
        initial_zoom: 0
        }

    window.timeline = new TL.Timeline('timeline-embed', timelinejson, options);

  }); // AJAX END
  
  };//FUNCTION END

/////////// Search link with BNF data //////

async function searchLinkedDataWithBNF(uri) {

  var query3 = "PREFIX owl: <http://www.w3.org/2002/07/owl#>" +
      "PREFIX adb: <http://data.soduco.fr/def/annuaire#>"+
      "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"+
      "PREFIX gsp: <http://www.opengis.net/ont/geosparql#>"+
      "PREFIX foaf: <http://xmlns.com/foaf/0.1/>"+
      "PREFIX skos: <http://www.w3.org/2004/02/skos/core#>"+
      "select distinct * where { <http://data.soduco.fr/id/entry/" + uri + "> owl:sameAs ?bnf." +
      " ?bnf a foaf:Person;" +
      " skos:prefLabel ?name ." +
      " FILTER (contains(STR(?bnf),'bnf'))" +
      "} group by ?bnf ?name order by ?name";

  var queryURL3 = repertoireGraphDB + "?query="+encodeURIComponent(query3)+"&?application/json"
  var html = document.getElementById('bnfdata')
 $.ajax({
    url: queryURL3,
    Accept: "application/sparql-results+json",
    contentType:"application/sparql-results+json",
    dataType:"json",
    data:''
  }).done((promise) => {
    if (promise.results.bindings.length > 0){
      $.each(promise.results.bindings, function(i,bindings){
        //console.log(uri,bindings.bnf.value,bindings.name.value)
        html.innerHTML = '<p><a href="' + bindings.bnf.value + '" target="_blank">' + bindings.name.value + '</a></p>'
      });
    } else {
      html.innerHTML = '<p><i>Pas de ressources identifiées.</i></p>'
    }
  });

};

/*******************
 * Style functions *
 *******************/

/// Extraction layer

function pointToLayerExtract(feature,latlng) {
    //Create markers of the 'extractions' layer
    return L.circleMarker(latlng, {
        radius:13,
        //fillColor: getColor(feature.properties.has_photo,feature.properties.has_daguer,feature.properties.has_opti),
        fillColor:' #0351f9',
        color: "#ffffff",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
    });
}

/// Reference layer

var geojsonMarkerOptionsRef = {
    //Markers of the reference layer
    radius:6,
    fillColor: "#FFC300",
    color: "#ffffff",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};

function pointToLayerRef(feature,latlng) {
    //Create points of the reference layer
    return L.circleMarker(latlng, geojsonMarkerOptionsRef);
}

/********** Icones *********/

function iconByName(name) {
	return '<i class="icon icon-'+name+'"></i>';
}

/****************
 *** Pop Up *****
 ****************/

function onEachFeature(feature, layer) {
    if (feature.properties.uri) {
      // Pop-up content for directories data in extraction layer
        texte = '<h4>'+ feature.properties.person +'</h4>'+
        '<p><b>Adresse (annuaire)</b> : ' + feature.properties.address + '<br>'+ 
        '<b>Adresse (géocodeur)</b> : ' + feature.properties.address_geocoding + '<br>';
        if (feature.properties.activity){
            texte += '<b>Activité</b> : ' + feature.properties.activity + '<br>';
        };
        texte += '<b>Année de publication</b> : ' + feature.properties.directoryDate + '<br>'+
        '<b>Annuaire</b> : ' + feature.properties.directoryName + '</br>'+
        "<b>Identifiant de l'entrée </b> : " + feature.properties.index + '</br></p>';
        //Affichage de la pop-up
        layer.bindPopup(texte);

      //Search link data with BNF ressources
      layer.on('click', function(e) {
        $('#bnfdata').empty();
        searchLinkedDataWithBNF(feature.properties.uri.substring(31, feature.properties.uri.length))
        createlinkDataSoduco(feature.properties.uri.substring(31, feature.properties.uri.length))
      });
        
    } else if (feature.properties.secteur) {
        if (feature.properties.prénoms && feature.properties.nom){
            texte = '<h4>' + feature.properties.prénoms + ' ' + feature.properties.nom + '</h4>'
        } else if (feature.properties.prénoms == null && feature.properties.nom) {
            texte = '<h4>' + feature.properties.nom + '</h4>'
        }
        texte += '<p><b>Adresse</b> : ' + feature.properties.street + ' ' + feature.properties.number + '<br>'
        if (feature.properties.rue_2) {
            texte += '<b>Seconde adresse </b> : ' + feature.properties.rue_2 + '<br>'
        }
        if (feature.properties.date)
            {texte += "<b>Période d'activité</b> : " + feature.properties.date + '<br></p>'}
        if (feature.properties.note) {
            texte += "<p>" + feature.properties.note + "</p>"
        }
        layer.bindPopup(texte);
    };

};



/********* Data functions **********/

function createGeoJson(JSobject){
    /**
     * Input : SPARQL request application/json result (js object)
     * Output : Geojson
     * Source : https://github.com/dhlab-epfl/leaflet-sparql/blob/master/index.html
     */
    
    //Init geojson
    var geojson = {"type": "FeatureCollection", "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } }, "features": []}
  
    //Iter on features
    $.each(JSobject.results.bindings, function(i,bindings){
  
      //Init feature
      feature = {
        type:"Feature",
        geometry: $.geo.WKT.parse(bindings.geom_wkt.value),
        properties: {}
      };
      //Fill properties
      $.each(JSobject.head.vars, function(j, property){
        feature.properties[property] = bindings[property].value;
      });
      geojson.features.push(feature);
    });
    if (geojson['features'].length == 0) {
      alert('Pas de données correspondant à cette recherche.')
    } else {
      //console.log(geojson['features'].length)
      return geojson
    }
  };


function createHeatMapArray(JSobject,MinYear,MaxYear) {

    var heatMapArray = []

    //Iter on features
    $.each(JSobject.results.bindings, function(i,bindings){
  
        //Init feature
        if (bindings.geom_wkt.length != 0) {
            if (bindings.directoryDate.value >= MinYear && bindings.directoryDate.value <= MaxYear) {
                var coords = $.geo.WKT.parse(bindings.geom_wkt.value)
                var feature = [coords.coordinates[1],coords.coordinates[0],1.0]
                heatMapArray.push(feature);
            }
        }
    })
    //console.log(heatMapArray)
      //Test if the query return some points
      //if (heatMapArray.length == 0) {
      // alert('Pas de données correspondant à cette recherche.')
      //} else {
      //  console.log(heatMapArray)
      //return heatMapArray
      //}
    return heatMapArray
}