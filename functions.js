var divtimeline = document.getElementById('timeline-embed')
var divmessage = document.getElementById('message')

//Event on input number
var inputNumberMin = document.getElementById('input-number-min');
var inputNumberMax = document.getElementById('input-number-max');

function createlinkDataSoduco(uri){
   //console.log(uri)
    /*
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
    */
      var query2 = "PREFIX adb: <http://data.soduco.fr/def/annuaire#> "+
      "PREFIX ont: <http://rdf.geohistoricaldata.org/def/directory#> "+
      "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "+
      "PREFIX owl: <http://www.w3.org/2002/07/owl#> "+
      "PREFIX fn: <http://www.w3.org/2005/xpath-functions#> "+
      "PREFIX prov: <http://www.w3.org/ns/prov#> "+
      "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> "+
      "PREFIX pav: <http://purl.org/pav/> "+
      "PREFIX locn: <http://www.w3.org/ns/locn#> "+
      "PREFIX gsp: <http://www.opengis.net/ont/geosparql#> "+
      'SELECT distinct ?uri ?index ?person (GROUP_CONCAT(DISTINCT ?activity ; SEPARATOR=" |||et||| ") as ?activities) ?address ?directoryName ?directoryDate '+
      "WHERE { <http://rdf.geohistoricaldata.org/id/directories/entry/" + uri + "> owl:sameAs ?uri."+
      "?uri a ont:Entry."+
      "?uri ont:numEntry ?index."+
      "?uri rdfs:label ?person."+
      "?uri prov:wasDerivedFrom ?directory."+
      "?directory rdfs:label ?directoryName."+
      "?directory pav:createdOn ?directoryDate."+
      "?uri locn:address ?add2."+
      "?add2 locn:fullAddress ?address."+
      "?add2 prov:wasGeneratedBy <http://rdf.geohistoricaldata.org/id/directories/activity/0001>."+
      "OPTIONAL{?uri <http://rdaregistry.info/Elements/a/P50104> ?activity.}"+
      //"FILTER ((?directoryDate > "+ inputNumberMin.value +") && (?directoryDate < " + inputNumberMax.value + ")). "+
      "} GROUP BY ?uri ?index ?person ?address ?directoryName ?directoryDate"+
      " ORDER BY ASC(?index) ASC(?directoryDate)"
      
    //console.log(query2)
    var queryURL2 = repertoireGraphDB + "?query="+encodeURIComponent(query2)+"&?outputFormat=rawResponse";

    //console.log(queryURL2)
    var timelinejson = {"title": {"text":{"headline":'Données liées'}}, "events": []}

    var options = {
      scale_factor:1,
      language:'fr',
      start_at_slide:1,
      hash_bookmark: false,
      initial_zoom: 0
      }

    $.ajax({
      url: queryURL2,
      Accept: "application/sparql-results+json",
      contentType:"application/sparql-results+json",
      dataType:"json",
      data:''
    }).done((promise) => {
      //Create Timeline JS JSON
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
            "text": '<p>' + bindings.activities.value + '</br>' + bindings.address.value + '<br/>Source : ' + bindings.directoryName.value + ' - ' + bindings.index.value + "<br/>Nombre d'entités liées : " + promise.results.bindings.length.toString() + '</p>'
          },
          "group":bindings.address.value,
          "background":{"color":"#1c244b"},
          "unique_id":uri
          }
        //console.log(feature)
        timelinejson.events.push(feature);
        });

      //console.log(timelinejson)
        
  }).done((promise) => {
    //console.log("####");
    //console.log(timelinejson.events.length);
    if (timelinejson.events.length > 1){
      divtimeline.setAttribute('style', 'height:800px;');
      window.timeline = new TL.Timeline('timeline-embed', timelinejson, options);
      message.innerHTML = '';
      //window.location.href="#ancretimeline"
    } else {
      //console.log("No timeline")
      divtimeline.setAttribute('style', 'height:0px;');
      message.innerHTML = '<p class="noentry">Aucune d\'entrée liée à ' + uri + '.</p>';
    }
   
}); // AJAX END
  

  };//FUNCTION END

/////////// Search link with BNF data //////


async function searchLinkedDataWithBNF(id) {

  var query3 = "PREFIX owl: <http://www.w3.org/2002/07/owl#>" +
      "PREFIX adb: <http://data.soduco.fr/def/annuaire#>"+
      "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"+
      "PREFIX gsp: <http://www.opengis.net/ont/geosparql#>"+
      "PREFIX foaf: <http://xmlns.com/foaf/0.1/>"+
      "PREFIX skos: <http://www.w3.org/2004/02/skos/core#>"+
      "SELECT DISTINCT * where { <http://rdf.geohistoricaldata.org/id/directories/entry/" + id + "> owl:sameAs ?uri." +
      " FILTER (regex(?uri,'bnf'))" +
      "}";
  console.log(query3)
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
        html.innerHTML = '<p id="bnfdata" style="height:fit-content;"><a href="' + bindings.uri.value + '" target="_blank">Voir les ressources associées sur data.bnf.fr</a></p>'
        console.log("Données liées : ")
      });
    } else {
      html.innerHTML = '<p id="bnfdata" style="height:fit-content;"></p>'
      console.log('Pas de ressources externes associées.')
    }
  });

};

/*******************
 * Style functions *
 *******************/

/// Extraction layer

function pointToLayerExtract(feature,latlng) {
    //Create markers of the 'extractions' layer
    return L.marker(latlng, 
      {icon: L.divIcon({ html: '', 
                        className:'clusters', 
                        iconSize: new L.point(12.5,12.5)})
  });

    /*return L.circleMarker(latlng, {
        radius:5,
        //fillColor: getColor(feature.properties.has_photo,feature.properties.has_daguer,feature.properties.has_opti),
        fillColor:' #0351f9',
        color: "#ffffff",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
    });*/
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

 function popUpDirectories(feature, layer) {
  texte = '<h4>'+ feature.properties.person +'</h4>'+
  '<p><b>Adresse (annuaire)</b> : ' + feature.properties.addresses + '<br>'+ 
  '<b>Adresse (géocodeur)</b> : ' + feature.properties.addresses_geocoding + '<br>';
  if (feature.properties.activities){
      texte += '<b>Activité</b> : ' + feature.properties.activities + '<br>';
  };
  texte += '<b>Année de publication</b> : ' + feature.properties.directoryDate + '<br>'+
  '<b>Annuaire</b> : ' + feature.properties.directoryName + '</br>'+
  "<b>Identifiant de l'entrée </b> : " + feature.properties.index + '</br></p>';
  layer.bindPopup(texte);
  //createlinkDataSoduco(feature.properties.index);
}

function onEachFeature(feature, layer) {
    if (feature.properties.uri) {
      // Pop-up content for directories data in extraction layer
        popUpDirectories(feature, layer)
      //Search link data with BNF ressources
      layer.on('click', function(e) {
        //Search external resources
        $('#bnfdata').empty();
        searchLinkedDataWithBNF(feature.properties.index)
        message.innerHTML = '<p class="noentry">Requête en cours d\'exécution : entrées liées à ' + feature.properties.person + ' (ID ' + feature.properties.index + ') <img src="./img/loading_cut.gif">.</p>';
        //Create timeline
        createlinkDataSoduco(feature.properties.index)
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

function openPopUp(id, clusterId){
  map.closePopup(); //which will close all popups
  map.eachLayer(function(layer){     //iterate over map layer
      if (layer._leaflet_id == clusterId){         // if layer is markerCluster
          layer.spiderfy(); //spiederfies our cluster
      }
  });
  map.eachLayer(function(layer){     //iterate over map rather than clusters
      if (layer._leaflet_id == id){         // if layer is marker
          layer.openPopup();
      }
  });
}

function sortTable() {
  //src : https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sort_table_number

  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("popuptable");
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[0];
      y = rows[i + 1].getElementsByTagName("TD")[0];
      //check if the two rows should switch place:
      if (Number(x.innerHTML) > Number(y.innerHTML)) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}