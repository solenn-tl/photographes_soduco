# Construction d'un graphe géohistorique à partir des annuaires du commerce parisien du 19e siècle : application aux photographes

**Ce dépôt est un dépôt de travail, la [version finalisée, présentée lors de la conférence IC 2023, se trouve ICI](https://github.com/soduco/ic_2023_photographes_parisiens)**

La chaîne de traitement proposée dans le projet SoDuCo pour construire un graphe de connaissances géohistorique à partir des annuaires du commerces parisien du 19e siècle débute par l'extraction du texte des annuaires (4.2) et la reconnaissance des entités nommées (4.3) au sein des entrées. Les approches proposées pour réaliser ces deux étapes sont décrites en détails dans ([Abadie et Al (2022)](https://github.com/soduco/paper-ner-bench-das22)).

La figure ci-dessous décrit les étapes de sélection et représentation des entrées en RDF (4.4), de liage des entrées (4.5) de géocodage (4.6) et de visualisation (5.2), mise en oeuvre à partir de la base de données des entrées d'annuaires.
<img src="https://github.com/solenn-tl/photographes_soduco/blob/main/doc/images/pipeline.png" width="800" text-align="center"/>

## Environnement et outils

* [Graph DB](https://graphdb.ontotext.com/)
* [Python](https://www.python.org/downloads/) (>= 3.8) + bibliothèques (*requirements_python.md*)
* Editeur de code ([PyCharm Community](https://www.jetbrains.com/fr-fr/pycharm/download/#section=windows) utilisé pour Python (environnements virtuels +++), [Visual Studio Code](https://code.visualstudio.com/download) pour le web)
* Serveur Apache (ex : [Laragon](https://laragon.org/download/))
* [Postgres](https://www.postgresql.org/download/) 12 avec Postgis (NB : r2rml ne fonctionne pas avec les versions > 12)
* [Sakey](https://lahdak.lri.fr/?q=content/sakey)
* [Silk](https://github.com/silk-framework/silk) : Workbench + Silk en lignes de commande
* [R2RML](https://github.com/nkons/r2rml-parser)
* HTML, CSS, Javascript ([Leaflet](https://leafletjs.com/))
