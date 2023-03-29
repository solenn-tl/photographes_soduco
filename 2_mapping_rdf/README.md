# 2. Conversion en RDF

Cette étape (section 4.4) vise à produire des ressources RDF à partir de la base de données relationnelle des entrées d'annuaires.
* **0_pour_sakey** : Fichier de configuration utilisé pour convertir les données d'un annuaire qui sont utilisées pour la recherche de clés avec Sakey ;
* **1_mapping_annuaires** : Fichier de configuration utilisé pour convertir les objets de la base de données relationnelle des annuaires en ressources RDF.

## Outil

* [R2RML](https://github.com/nkons/r2rml-parser)

## Pré-requis

* Données stockées dans une base de données relationnelle en PostGres (<=12) ;
* Fichier de mapping (correspondance entre les colonnes de la base de données Postgres et les propriétés des ressources RDF) au format _.ttl_ ;

## Mapping

*Défini dans le fichier mapping_annuaires.ttl*

Comprend :
* liste des préfix des vocabulaires utilisés ;
* requête SQL de type SELECT pour sélectionner les entrées d'annuaires et les propriétés à conserver ;
* liste des propriétés associées à chaque entrée d'annuaire.

## Utilisation de R2RML

### Structure

![structure_r2rml](https://github.com/solenn-tl/photographes_soduco/blob/main/doc/images/R2RML.png)

### Etapes

1. Mettre le fichier de _mapping_ dans le dossier _data_
2. Remplacer le fichier _r2rm.properties_ présent dans le dossier de R2RML par celui associé au fichier de mapping choisi OU définir les propriétés suivantes dans le fichier _r2rml.properties_ :
    * _mapping.file_ : data/nom-du-fichier-de-mapping.ttl (ici *mapping_annuaires.ttl*)
    * _mapping.file.type_ : type du fichier RDF de mapping (ici *TURTLE*)
    * _default.namespace_ : URI que l'on souhaite associer aux ressources (ici *http://rdf.geohistoricaldata.org/id/entry/*)
    * _db.url_ : adresse de la base de données Postgres locale. Exemple à adapter à votre installation de Postgres : *jdbc:postgresql://localhost:5433/photographes* avec 
        * *localhost* : hôte de la base de données
        * *5433* : port sur lequel écoute Postgres (souvent 5432)
        * *photographes* : nom de la base de données
    * _db.login_ : identifiant de connexion à la base de données
    * _db.password_ : mot de passe de connexion à la base de données
    * _jena.destinationFileName_ : _resultats/nom-de-fichier-resultat.ttl_ (.nt pour utilisation dans Sakey)
    * _jena.destinationFileSyntax_ : type du fichier RDF résultat (ici *TURTLE*, mettre .nt pour Sakey)
    * _jena.encodeURLs=false_
3. Lancer le mapping en cliquant sur _r2rml-parser.bat_ (sous Windows) ou _r2rml-parser.sh_ (sous Linux)
