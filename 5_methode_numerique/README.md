# 5. Méthode d'appariement numérique

Cette partie traite de l'appariement des entrées d'annuaires avec Silk en utilisant une méthode fondée sur les données (4.5). 
Sa principale caractéristique est de comparer les propriétés des ressources en utilisant une distance d'édition. La distance d'édition est fixée pour chaque propriété par l'utilisateur en fonction de ses observations.

Cette méthode est utilisée pour :
1. lier les entrées d'annuaires entre-elles ;
2. lier les entrées d'annuaires avec d'autres ressources (ex : data BNF).

## Outils

* **GraphDB**
* **Silk (jar)** : lignes de commande + fichier XML de paramétrage (utilisé pour automatiser la création des liens selon un seuil de confiance fixé). [**Tutoriel**](https://github.com/solenn-tl/photographes_soduco/blob/main/5_methode_numerique/lancerSilk.md)
* **Silk Workbench** : interface graphique. Utile dans certains cas :
    * Créer la chaîne de traitement de manière plus conviviale qu'avec le fichier de paramétrage XML ;
    * Réaliser une évaluation manuelle des résultat de l'appariement, ce qui permet d'affiner les seuils
    * Exporter les résultats validés manuellement (format _Alignement_, converssion possible en Turtle avec ___.py)
    * <b>ATTENTION</b> : Silk Workbench ne permet pas d'exporter les résultats en fonction du score de confiance associer. Il faut utiliser le *.jar* pour pouvoir le faire.