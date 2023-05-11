/***************
 * INIT DATA ***
 **************/

//Requête SPARQL pour récupérer les données sur les monuments historiques de Paris
/*		
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
*/

var query = "PREFIX adb: <http://data.soduco.fr/def/annuaire#> "+
"PREFIX ont: <http://rdf.geohistoricaldata.org/def/directory#> "+
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "+
"PREFIX owl: <http://www.w3.org/2002/07/owl#> "+
"PREFIX fn: <http://www.w3.org/2005/xpath-functions#> "+
"PREFIX prov: <http://www.w3.org/ns/prov#> "+
"PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> "+
"PREFIX pav: <http://purl.org/pav/> "+
"PREFIX locn: <http://www.w3.org/ns/locn#> "+
"PREFIX gsp: <http://www.opengis.net/ont/geosparql#> "+
"select ?uri ?index ?person ?activity ?address ?geom_wkt ?directoryName ?directoryDate "+
"where { "+
"?uri a ont:Entry."+
"?uri ont:numEntry ?index."+
"?uri rdfs:label ?person."+
"?uri prov:wasDerivedFrom ?directory."+
"?directory rdfs:label ?directoryName."+
"?directory pav:createdOn ?directoryDate."+
"?uri locn:address ?add."+
"?add locn:fullAddress ?address."+
"?add gsp:hasGeometry ?geom."+
"?geom gsp:asWKT ?geom_wkt."+
"OPTIONAL{?uri <http://rdaregistry.info/Elements/a/P50104> ?activity.}"

var queryURL = repertoireGraphDB + "?query="+encodeURIComponent(query+'}')+"&?outputFormat=rawResponse";

var queryURL = "https://rdf.geohistoricaldata.org/#query=PREFIX+adb%3A+%3Chttp%3A%2F%2Fdata.soduco.fr%2Fdef%2Fannuaire%23%3E%0APREFIX+ont%3A+%3Chttp%3A%2F%2Frdf.geohistoricaldata.org%2Fdef%2Fdirectory%23%3E%0APREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0APREFIX+owl%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2002%2F07%2Fowl%23%3E%0APREFIX+fn%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2005%2Fxpath-functions%23%3E%0APREFIX+prov%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23%3E%0APREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%0APREFIX+pav%3A+%3Chttp%3A%2F%2Fpurl.org%2Fpav%2F%3E%0APREFIX+locn%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Flocn%23%3E%0APREFIX+gsp%3A+%3Chttp%3A%2F%2Fwww.opengis.net%2Font%2Fgeosparql%23%3E%0A%0Aselect+%3Furi+%3Fperson+%3Factivity+%3Faddress+%3Fgeom_wkt+%3FdirectoryName+%3FdirectoryDate+%0Awhere+%7B+%0A++++%3Furi+a+ont%3AEntry.%0A++++%3Furi+rdfs%3Alabel+%3Fperson.%0A++++%3Furi+prov%3AwasDerivedFrom+%3Fdirectory.%0A++++%3Fdirectory+rdfs%3Alabel+%3FdirectoryName.%0A++++%3Fdirectory+pav%3AcreatedOn+%3FdirectoryDate.%0A++++%3Furi+locn%3Aaddress+%3Fadd.%0A++++%3Fadd+locn%3AfullAddress+%3Faddress.%0A++++%3Fadd+gsp%3AhasGeometry+%3Fgeom.%0A++++%3Fgeom+gsp%3AasWKT+%3Fgeom_wkt.%0A++OPTIONAL%7B%3Furi+%3Chttp%3A%2F%2Frdaregistry.info%2FElements%2Fa%2FP50104%3E+%3Factivity.%7D%0A++Filter+((%3FdirectoryDate+%3E+1860)+%26%26+(%3FdirectoryDate+%3C+1870)).%0A%7D+%0AORDER+BY+ASC(%3FdirectoryDate)&contentTypeConstruct=text%2Fturtle&contentTypeSelect=application%2Fsparql-results%2Bjson&endpoint=https%3A%2F%2Frdf.geohistoricaldata.org%2Fsparql&requestMethod=POST&tabTitle=Query&headers=%7B%7D&outputFormat=rawResponse"

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
      geometry: $.geo.WKT.parse(bindings.geom_wkt.value.replace('<http://www.opengis.net/def/crs/OGC/1.3/CRS84> ','')),
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

  //Get value in form fields
  per = document.getElementById("per").value;
  act = document.getElementById("act").value;
  spat = document.getElementById("spat").value;
  //Complete SPARQL query
  /// Empty inputs
  if (per.length > 0 && act.length == 0 && spat.length == 0) {
    compquery = "FILTER ( regex(?person,'" + per + "')) . }"
  } else if (per.length == 0 && act.length > 0 && spat.length == 0) {
    compquery = "FILTER ( regex(?activity,'" + act + "')) . }"
  } else if (per.length == 0 && act.length == 0 && spat.length > 0) {
    compquery = "FILTER ( regex(?address,'" + spat + "')) . }"
    // Two
  } else if (per.length > 0 && act.length > 0 && spat.length == 0) {
    compquery = "FILTER ( regex(?person,'" + per + "') && " + 
    "regex(?activity,'" + act + "')" +
    ") .}"
  } else if (per.length == 0 && act.length > 0 && spat.length > 0) {
    compquery = "FILTER ( regex(?activity,'" + act + "') && " + 
    "regex(?address,'" + spat + "')" +
    ") .}"
  } else if (per.length > 0 && act.length == 0 && spat.length > 0) {
    compquery = "FILTER ( regex(?person,'" + per + "') && " + 
    "regex(?address,'" + spat + "')" +
    ") .}"
    // ALL
  } else if (per.length > 0 && act.length > 0 && spat.length > 0) {
    compquery = "FILTER ( regex(?person,'" + per + "') && " + 
    "regex(?activity,'" + act + "') && " +
    "regex(?address,'" + spat + "')" +
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
  console.log(myVar)
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
