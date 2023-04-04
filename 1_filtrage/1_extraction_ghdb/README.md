# 1.1 Extraction des données

Deux possibilités pour extraire les données :
- créer un schéma "Extraction" temporaire dans la base de données SoDUCo à l'aide des scripts  *1_requetes_base_soduco.sql* puis *2_requetes_base_locale.sql*;
- écrire une copie locale du résultat du filtrage à l'aide d'un script Python ;

## Fichier de requêtes SQL

Structuré en trois parties : 

```
-- requetes_base_soduco.sql
  |--- partie 1 : filtrage des entrées selon une liste de mots-clés inscrits dans le WHERE
-- requetes_base_locale.sql
  |--- partie 2 : création d'une copie de la table des extractions pré-traitée pour le raisonnement (suppression des caractères spéciaux, passage en minuscules, création d'un champ Adresse (LOC + CARD))
  |--- partie 3 : création d'une table utilisée ensuite pour la conversion en RDF (suppression des TITRE, des lignes avec des champs PER, ACT ou ADDRESS vides)
```

La partie 1 doit être exécutée dans la base de données GeoHistoricalData (membres du projet SoDUCo) ou dans une base de données locale construite à partir des données disponibles sur [Nakala](https://nakala.fr/u/datas/10.34847/nkl.98eem49t) au format JSON.

Les parties 2 et 3 doivent être exécutées dans la base de données locale.

## Outil Python

### Structure

```
-- scripts_python
  |--- connect : initialisation des connexions aux bases de données SoDUCo et locale 
  |--- requetes : requêtes permettant de filtrer la base SoDUCo et de créer une table avec les résultats dans la base locale
  |--- stats : scripts permettant de faire une première analyse statistique des données extraites
```
