# 4. Méthode d'appariement logique

La méthode logique permet de créer des liens entre les entrées d'annuaire en comparant les valeurs des clés de manière exacte. 

## Pré-requis

* GraphDB
* Entrées d'annuaires extraites de la base de données SoDUCo dans un format RDF
* Ontologie dans laquel sont définies les clés (propriétés _hasKey_) : (_adbAllKeysSolennv3.ttl_)

## Ontologie

* Pour visualiser graphiquement l'ontologie (_adbAllKeysSolennv3.ttl_) : [Webvowl](https://service.tib.eu/webvowl/)

![ontologie_annuaires](https://github.com/solenn-tl/photographes_soduco/blob/main/doc/images/ontologie.png)

## Etapes
**_Aide pour l'utilisation de GraphDB [ICI](https://github.com/solenn-tl/photographes_soduco/blob/main/doc/Tutoriel_GraphDB.pdf)_**

1. Installer GraphDB (voir Tutoriel - I et II)
2. Créer un répertoire dans lequel seront déposées vos données et votre ontologie (voir Tutoriel - III)
    * **Paramétrage** : 
        * Dans un premier temps, il est préférable de créer un répertoire avec un raisonneur actif en désactivant la propagation des liens _sameAS_ (Tutoriel - III.2).
3. Importer les données dans le répertoire (Tutoriel - IV).
4. Importer l'ontologie (_adbAllKeysSolennv3.ttl_) dans le répertoire. Le raisonnement se lance automatiquement (Tutoriel - IV).
    * Temps nécessaire (exemple des photographes ) : pour 34 000 entrées (~ 38 000 ressources), entre 36h et 48h de calcul.

<img src="https://github.com/solenn-tl/photographes_soduco/blob/main/doc/images/Propagation_liens.png" width="400"/>

* (a) Exemple de résultat obtenu avec un raisonnement **SANS** propagation de liens.
* (b) Exemple de résultat obtenu avec un raisonnement **AVEC** propagation de liens.

## Visualisation des résultats

* Visualisation des résultats pour chaque ressource (Tutoriel - V).
* Quelques requêtes SPARQL pour une analyse plus globale :

### Compter le nombre total de liens sameAs distincts dans le répertoire
```
PREFIX adb: <http://data.soduco.fr/def/annuaire#> 
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
PREFIX gsp: <http://www.opengis.net/ont/geosparql#> 
PREFIX owl: <http://www.w3.org/2002/07/owl#>
select (count(distinct *) as ?count)
where {?s owl:sameAs ?p.}
```

### Compter le nombre total de liens sameAs distincts dans le répertoire qui ne lient pas une ressource à elle-même
*NB : plus intéressant que la requête précédente*
```
PREFIX adb: <http://data.soduco.fr/def/annuaire#> 
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
PREFIX gsp: <http://www.opengis.net/ont/geosparql#> 
PREFIX owl: <http://www.w3.org/2002/07/owl#>
select (count(distinct *) as ?count)
where {?s owl:sameAs ?p.
    FILTER (?s != ?p) }
```

