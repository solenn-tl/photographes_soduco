# Appli web de visualisation des données

Cetta application web permet d'interroger les ressources disponibles dans le triplestore par le biais d'un formulaire de recherche (il complète une requête SPARQL). 
Les données peuvent être visualisées de deux manières : 
* spatialement (pour celles qui ont pu être géocodées) : affichage dans une carte web-interrogeable
* temporelement : au clic sur un point, une requête SPARQL est lancée pour récupérer toutes les ressources du sous-graphe associé. Les données sont représentées sous la forme d'une frise chronologique.

La dernière mise à jour de cette version a été réalisée en novembre 2022.

## Environnement et outils

* Graph DB (version utilisée : 9.10.3)
* Editeur de texte
* Serveur Apache (ex : [Laragon](https://laragon.org/))
* HTML, CSS, Javascript (Leaflet)

## Installation et utilisation
* Installer l'application : voir [tutoriel d'installation avec Laragon - partie 1](https://github.com/solenn-tl/photographes_soduco/blob/main/doc/Tutoriel_Laragon.pdf)
* Démarrer GraphDB (cf [Tutoriel GraphDB](https://github.com/solenn-tl/photographes_soduco/blob/main/doc/Tutoriel_GraphDB.pdf)) : 
* Choisir (ou créer) le répertoire GraphDB qui contient le graphe spatio-temporel à visualiser (cf [Tutoriel GraphDB](https://github.com/solenn-tl/photographes_soduco/blob/main/doc/Tutoriel_GraphDB.pdf)) ;
* Ouvrir le fichier _parameters.js_ avec un éditeur de texte ;
* Copier l'adresse du répertoire GraphDB dans le fichier _parameters.js_ (remplacer l'adresse actuelle) (cf [Tutoriel GraphDB](https://github.com/solenn-tl/photographes_soduco/blob/main/doc/Tutoriel_GraphDB.pdf)) ;
* Toujours dans _parameters.js_ : choisir d'afficher ou non le fichier de référence (false par défaut, mettre _true_ pour voir l'exemple des photographes)
* Démarrer Laragon : voir [tutoriel d'installation avec Laragon - partie 2](https://github.com/solenn-tl/photographes_soduco/blob/main/doc/Tutoriel_Laragon.pdf)

## Améliorations envisagées

* Moteur de recherche moins sensible à la casse et aux caractères spéciaux.
* Visualisation des mots-clés (couleurs) ;
* Visualisation du graphe ?

## Version précédente

[Voir la version v.0.1 de l'application (Août 2022)](https://github.com/solenn-tl/stage_demo_photographes)
