/**************************************
 ***************** Map ****************
*************************************/
var map = L.map('map',{
    //Full screen settings
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    },
    layers:[wmsAndriveau]
}).setView([48.859972,2.347984],13);

L.control.scale().addTo(map);

 /************************************
 ************* Draw layer ************
 * https://github.com/Leaflet/Leaflet.draw/issues/315
 *************************************/

// FeatureGroup is to store editable layers
// Initialise the FeatureGroup to store editable layers
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

self.drawControlFull = new L.Control.Draw({
    draw: {
        marker: false,
        polyline: false,
        circlemarker:false,
        circle:false
    },
});

self.drawControlEdit = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems,
    edit: false,
    save:false
  },
  draw: false
});
map.addControl(drawControlFull);

map.on('draw:created', function(e) {
  var type = e.layerType,
    layer = e.layer;
  
	self.drawControlFull.remove();
	self.drawControlEdit.addTo(map);
  
  drawnItems.addLayer(layer);
  map.fitBounds(drawnItems.getBounds());
});

map.on('draw:deleted', function (e) {
	self.drawControlEdit.remove();
	self.drawControlFull.addTo(map);
});

map.on(L.Draw.Event.CREATED, function (e) {
    //console.clear();
    var type = e.layerType
    var layer = e.layer;
    
    // Do whatever else you need to. (save to db, add to map etc)
    
    drawnItems.addLayer(layer);
    
  });


/**************************************
 **************** Logo ****************
*************************************/

//logo position: bottomright, topright, topleft, bottomleft
var logo = L.control({position: 'bottomleft'});
logo.onAdd = function(map){
    var div = L.DomUtil.create('div', 'logo');
    div.innerHTML= "<a href='https://soduco.github.io'><img class='logo' src='data/soduco_logo.png'/></a>";
    return div;
}
logo.addTo(map);
