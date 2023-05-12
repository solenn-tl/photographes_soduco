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

/**************************************
 *********** Layer control ************
 *************************************/
 
 var baseLayers = {
    "Jacoubet (1836)":wmsJacoubet,
    "Andriveau (1849)":wmsAndriveau,
    "Atlas municipal (1888)":wmsbhdv,
    "Plan IGN (2022)":GeoportailFrance_plan
}

if (afficherRef === true) {
    var overLayers = {
        //"Extraction - Popup":extractgroup,
        //"Extraction - Heatmap":heat,
        "Référence (Durand et al. 2015)":refgroup
    }
    var layerControl = L.control.layers(baseLayers, overLayers).addTo(map);
} else {
    var layerControl = L.control.layers(baseLayers).addTo(map);
}

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
