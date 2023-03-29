# 0. Constitution d'une liste de mots-clés

_Ce dossier présente la méthode de création d'une liste de mots-clés utilisable pour sélectionner les entrées d'annuaires relatives aux photographes_.

Les entrées d'annuaires et les entités nommées reconnues dans le texte des entrées, sont préalablement stockées dans une base de données relationnelle.

**Dans l'article : Partie 4.4 - Sélection et représentation des entrées en RDF**

## Méthode

A partir de la liste des photographes établie par des historiens (Durand 2015) (dossier *1_trancription*) :
1. Recherche individuelle des photographes de la liste dans la base de données des entrées d'annuaires en s'appuyant sur leur nom ET/OU leur adresse ET/OU leur profession;
2. Production (manuelle) d'une liste des mots associés aux photographes de la liste qui reviennent de manière récurrente dans la colonne _Activité_ ;
3. Parmi les mots de la liste, sélection des plus courants/spécialisés pour limiter le bruit ;

## Quelques requêtes SQL

Exemples de requêtes utilisées pour trouver manuellement des photographes de la liste

* Retrouver les entrées dont l'entité *PER* contient le nom "nadar"
```
SELECT *
FROM directories.elements AS e
WHERE e.persons ILIKE "%nadar%"
ORDER BY e.published
```

* Retrouver les entrées dont l'entité *PER* contient le mot "cheva" (pour Chevallier) et l'entité *ACT* contient "opti" (pour opticien)
```
SELECT *
FROM directories.elements AS e
WHERE e.activities ILIKE "%opti%" AND e.persons ILIKE "%cheva%"
ORDER BY e.published
```

## Mots-clés retenus

### Liste étendue

### Liste finale

Trois mots-clés ont été conservés : 
* _photo_ : relatif à "Photographe", "Photographie"...
* _daguer_ : relatif au "Daguerréotype" (première technique commerciale de photographie)
* _opti_ : relatif à "Optique", "Opticien" (nombreux opticiens devenus photographes, vendeurs de matériels d'optique => lentilles de photographie)

## Bibliographie

* Durand, Marc. 2015. _De l’image fixe à l’image animée :  1820-1910. Tome 2 : actes des notaires de Paris pour servir à l ’histoire des photographes et de la photographie._ 2 vol. 2. Pierrefitte-sur-Seine: Archives nationales.
