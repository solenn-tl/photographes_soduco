# 5.2 Appariement des entrées avec d'autres sources de données

## Outil

* Silk Workbench

## Données

```
-- source
  |--- photographie_bnf.ttl : ressources RDF relatives aux photographes issues de DATA BNF ;
-- outils
  |--- alignement_to_nt.py : permet de convertir des liens obtenus au format Alignement en format N-Triples ;
-- resultats
  |--- referenceLinks-v1-bnf-link.xml : liens validés manuellement (format Alignement);
  |--- positivelinks.nt : liens validés manuellement (format N-Triples);
  |-- fichesDataBNF_appariees.csv : ressources de la BNF qui ont pu être associées à des entrées d'annuaires;
```

## Récupération des données data.BNF sur les photographes

L'exemple proposé ici consiste à apparier des données des annuaires avec les photographes répertoriés sur [data.BNF](https://data.bnf.fr/).

Requête SPARQL à exécuter sur https://yasgui.triply.cc/ en donnant l'adresse du endpoint de la bnf https://data.bnf.fr/sparql 

```
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
CONSTRUCT {
 ?s a foaf:Person;
 bnf-onto:firstYear ?fy ;
 bnf-onto:lastYear ?ly ; 
 skos:prefLabel ?pf;
 skos:altLabel ?al.
}
WHERE {
  ?c a skos:Concept; skos:prefLabel ?pf; skos:altLabel ?al; foaf:focus ?s.
  ?s a foaf:Person ;
  bnf-onto:firstYear ?fy ;
  bnf-onto:lastYear ?ly ;
  rdagroup2elements:countryAssociatedWithThePerson <http://id.loc.gov/vocabulary/countries/fr> ;
  rdagroup2elements:fieldOfActivityOfThePerson <http://dewey.info/class/770/>, "Photographie" .
  Filter (?fy > 1760 && ?fy < 1885)
} 
```

Le résultat obtenu est disponibled ans le fichier */sources/photographie_bnf.ttl*

## Paramètres de liage avec Silk Workbench

Chaîne de traitement mise en place avec Silk Workbench. 
<img src="https://github.com/solenn-tl/photographes_soduco/blob/main/doc/images/params_silk_bnf.png" width="900" text-align="center"/>

## Validation manuelle

Les liens d'appariement entre les données issues des annuaires et les ressources de DATA BNF sont évalués manuellement dans Silk Workbench. 
Les liens corrects exportés au *Alignement* (seul format disponible). Le script Python *alignement_to_nt.py* permet de convertir des liens du format *Alignement* en format *N-Triples*.