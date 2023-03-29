# Projet Python

## Pré-requis

* Installer Python (>= 3.8)
* Installer les bibliothèques suivantes :
    * sqlalchemy
    * time
    * datetime
    * pandas
    * plotly.express
    * plotly.io
```
python3 -m pip install pandas plotly.express plotly.io sqlalchemy time datetime
```

## Utilisation

* Dossier *connect*
    * Renseigner les informations de connexions aux bases de données locale et SoDUCo (fichiers .py)
* Dossier *requetes*
    * Mettre à jour la liste des mots-clés utilisés pour l'extraction dans le fichier *keywords_large_list.txt*
    * Mettre à jour les paramètres dans la section PARAMS du fichier *requetes_ACT_keywords.py*
    * Exécuter le script *requetes_ACT_keywords.py*
* Dossier *stats* (OPTIONNEL)
    * Mettre à jour les paramètres dans la section PARAMS des scripts
    * Exécuter le script

## Structure du projet

### *connect*

Contient les scripts de connexions aux bases de données.

### *requetes*

Contient le script nécessaire pour réaliser la première étape du filtrage des données :
* sélection des entrées à l'aide d'une liste de mots-clés fournie dans un fichier .txt dans la base SoDUCo
* création d'une table dans la base de données locale et écriture des données sélectionnées précédement
* création des index

Il remplace le script *1_requetes_base_soduco.sql*.

Les étapes suivantes (nettoyage des chaînes de caractères) sont réalisées directement dans pgAdmin en exécutant le script *2_requetes_base_locale.sql*.

### *stats*

Contient des scripts utilisés pour faire une première analyse statistique du sous-ensemble de données extraites et stockées dans une base de données locale.