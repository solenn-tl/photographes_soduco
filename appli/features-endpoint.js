/***************
 * INIT DATA ***
 **************/

//Requête SPARQL pour récupérer les données sur les monuments historiques de Paris		
var query = "PREFIX adb: <http://data.soduco.fr/def/annuaire#>"+
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"+
"PREFIX gsp: <http://www.opengis.net/ont/geosparql#>"+
"select ?uri ?index ?person ?activity ?address ?address_geocoding ?geom_wkt ?directoryName ?directoryDate "+
"where { ?uri a adb:Entry ;"+
"rdfs:label ?person ;"+
"adb:activity ?activity ;"+
"adb:address ?address ;"+
"adb:numEntry ?index ;"+
"adb:address_geocoding ?address_geocoding ;"+
"gsp:asWKT ?geom_wkt ;"+
"adb:directoryName ?directoryName ;"+
"adb:directoryDate ?directoryDate ." //Le where de la requête SPARQL n'est pas fermé pour ajouter les filtres selon les entrées
 
var queryURL = repertoireGraphDB + "?query="+encodeURIComponent(query+'}')+"&?application/json";

let compquery = ''
let finalquery = query + '}'

/******************
 ***** Init var ***
 *****************/

var myVar;
var extract;
var extractgroup = L.featureGroup();

/*****************************************
**************** Slider  *****************
****************************************/
 
var slidervar = document.getElementById('slider');
noUiSlider.create(slidervar, {
    connect: true,
    start: [ 1860, 1880 ], //Start period
    step:1,                //1 year
    behaviour: 'drag',
    range: {
        min: 1790,         //Min year
        max: 1910          //Max year
    },
    format: wNumb({
        decimals: 0
    }),
    tooltips: false,
    pips: {
        mode: 'positions',
        values: [0, 25, 50, 75, 100],
        density: 10
    }
});

//Event on input number
var inputNumberMin = document.getElementById('input-number-min');
var inputNumberMax = document.getElementById('input-number-max');

//CONNECT SLIDER WITH DATA
//Set default value on input number
document.getElementById('input-number-min').setAttribute("value", 1860);
document.getElementById('input-number-max').setAttribute("value", 1880);

/**FORM */

let per = document.getElementById("per").value;
let act = document.getElementById("act").value;
let spat = document.getElementById("spat").value;
let html = document.getElementById("content");
let coordp;

/***************
 * FUNCTIONS ***
 **************/
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
    console.log(geojson['features'].length)
    return geojson
  }
};


function requestData() {
  var extract;
  var extractgroup = L.featureGroup();
  //Clear Data BNF links
  /*var clustergroup = L.markerClusterGroup({
    maxClusterRadius:0,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    chunkedLoading:true,
    iconCreateFunction: function (cluster) {
      var markers = cluster.getAllChildMarkers();
      var html = '<div class="circle">' + markers.length + '</div>';
      return L.divIcon({ html: html, className: 'cluster', iconSize: L.point(8, 8) });
  },
  });*/

  //Get value in form fields
  per = document.getElementById("per").value;
  act = document.getElementById("act").value;
  spat = document.getElementById("spat").value;
  //Complete SPARQL query
  /// Empty inputs
  if (per.length > 0 && act.length == 0 && spat.length == 0) {
    compquery = "FILTER ( contains(lcase(?person),'" + per + "'@fr)) . }"
  } else if (per.length == 0 && act.length > 0 && spat.length == 0) {
    compquery = "FILTER ( contains(lcase(?activity),'" + act + "'@fr)) . }"
  } else if (per.length == 0 && act.length == 0 && spat.length > 0) {
    compquery = "FILTER ( contains(lcase(?address),'" + spat + "'@fr)) . }"
    // Two
  } else if (per.length > 0 && act.length > 0 && spat.length == 0) {
    compquery = "FILTER ( contains(lcase(?person),'" + per + "'@fr) && " + 
    "contains(lcase(?activity),'" + act + "'@fr)" +
    ") .}"
  } else if (per.length == 0 && act.length > 0 && spat.length > 0) {
    compquery = "FILTER ( contains(lcase(?activity),'" + act + "'@fr) && " + 
    "contains(lcase(?address),'" + spat + "'@fr)" +
    ") .}"
  } else if (per.length > 0 && act.length == 0 && spat.length > 0) {
    compquery = "FILTER ( contains(lcase(?person),'" + per + "'@fr) && " + 
    "contains(lcase(?address),'" + spat + "'@fr)" +
    ") .}"
    // ALL
  } else if (per.length > 0 && act.length > 0 && spat.length > 0) {
    compquery = "FILTER ( contains(lcase(?person),'" + per + "'@fr) && " + 
    "contains(lcase(?activity),'" + act + "'@fr) && " +
    "contains(lcase(?address),'" + spat + "'@fr)" +
    ") .}"
  } else if (per.length === 0 && act.length === 0 && spat.length === 0) {
    compquery = '} order by ASC(?directoryDate)'
  };
  //Create the final query
  finalquery = query + compquery;

  //Create the query URL				
  queryURL = repertoireGraphDB + "?query="+encodeURIComponent(finalquery)+"&?application/json";


/*******************
 ***** MAIN ********
 ******************/

//Initial ajax request
$.ajax({
  url: queryURL,
  Accept: "application/sparql-results+json",
  contentType:"application/sparql-results+json",
  dataType:"json",
  data:''
}).done((promise) => {
  // Create GeoJSON with Graph DB data
  myVar = createGeoJson(promise)
  
  // Create Geojson layer for Leaflet
  extract = L.geoJSON(myVar,{
    onEachFeature: onEachFeature,
    pointToLayer:pointToLayerExtract,
    filter: function(feature, layer) {
        return (feature.properties.directoryDate <= 1860) && (feature.properties.directoryDate >= 1880);
        }
  });

  //Create Feature group
  extractgroup.removeLayer(extract);
  extract.addTo(extractgroup);
  extractgroup.addTo(map);
  extract.getAttribution = function() { return "Dataset <i>Photographes</i>' SoDUCo"; };
  extract.addTo(map);
  
  inputNumberMin.addEventListener('change', function(){
      slidervar.noUiSlider.set([this.value, null]);
  });
  inputNumberMax.addEventListener('change', function(){
      slidervar.noUiSlider.set([null, this.value]);
  });
  
  //Update values on change
  slidervar.noUiSlider.on('update', function( values, handle ) {
      /**** Slider update */
      //console.log(handle);
      if (handle==0){
          document.getElementById('input-number-min').value = values[0];
      } else {
          document.getElementById('input-number-max').value =  values[1];
      }
      rangeMin = document.getElementById('input-number-min').value;
      rangeMax = document.getElementById('input-number-max').value;

      /**** Extraction layer */
      extractgroup.removeLayer(extract);
      //Repopulate it with filtered features
      extract = new L.geoJson(myVar,{
          onEachFeature: onEachFeature,
          filter:
              function(feature, layer) {
                return ((feature.properties.directoryDate <= rangeMax) && (feature.properties.directoryDate >= rangeMin))
              },
          pointToLayer: pointToLayerExtract
      })
      //and back again into the cluster group
      extract.addTo(extractgroup);
      extractgroup.addTo(map);
      extract.getAttribution = function() { return "Dataset <i>Photographes</i>' SoDUCo"; };
      extract.addTo(map);
      
});
});
}; 
