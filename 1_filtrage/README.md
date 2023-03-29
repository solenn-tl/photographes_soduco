# 1. Filtrage, pré-traitement et statistiques des entrées

L'étape de sélection et représentation des entrées en RDF (4.4) commence par la sélection d'un sous-ensemble d'entrées pertinentes pour le cas d'application (ex : photographes) dans la base de données des entrées et de leurs entités nommées. L'objectif de cette pré-sélection est de réduire la quantité de données à lier pour faciliter les traitements et limiter les risques d'erreurs liés aux homonymes ou aux erreurs d'OCR.

## Accès aux données brutes

Les données extraites des annuaires et structurées par reconnaissance des entrées et de leurs entités nommées sont disponibles :
* sur geohistoricaldata (base de données Postgres) **(uniquement pour les membres du projet SoDUCo**);
* sur un [dépôt Nakala](https://nakala.fr/u/datas/10.34847/nkl.98eem49t) (format JSON). 

## Outils

Deux possibilités pour filtrer les données et créer un sous-ensemble utilisable pour le liage (détails dans *1_extraction_ghdb*):
* scripts SQL ;
* scripts Python.