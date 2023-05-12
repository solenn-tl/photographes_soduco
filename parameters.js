/***********************************************************************
 * Adresse du répertoire GraphDB où se trouve le graph spatio-temporel *
 * *********************************************************************/

/* Remplacer la valeur actuelle par l'adresse de votre répertoire */
/*var repertoireGraphDB = "http://HPE2101P101:7200/repositories/photographes-final"*/

var repertoireGraphDB = "https://rdf.geohistoricaldata.org/sparql/"

/***********************************************************************
 * **************** Affichage d'une couche de référence ****************
 * *********************************************************************/

/*Le fichier de référence proposé dans features-ref.js concerne uniquement les photographes. Le geojson associé se trouve dans data.*/

/* Y-a-t'il une couche de référence à afficher sur la carte ?*/
/*Valeur de la variable afficherRef (en minuscules) : true OU false */
var afficherRef = false
