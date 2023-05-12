/**************************************
 *********** Layer control ************
 *************************************/
 
 var baseLayers = {
    "Jacoubet (1836)":wmsJacoubet,
    "Andriveau (1849)":wmsAndriveau,
    "Atlas municipal (1888)":wmsbhdv,
    "Plan IGN (2022)":GeoportailFrance_plan
}

var overLayers = {
    "Couche temporaire":drawnItems,
    "Référence (Durand et al. 2015)":refgroup
}

 var layerControl = L.control.layers(baseLayers, overLayers).addTo(map);