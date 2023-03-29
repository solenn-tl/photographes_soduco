# 0.1 Données de référence

## Documents

* *Transcription_Durand_2015_et_notes.xlsx* : informations sur les photographes identifiées par Durand (2015) dans les actes notariés classées par secteur dans Paris. Les dernières colonnes correspondent aux résultats de la recherche manuelle réalisée pour l'identification de mots-clés.

* *Transcription_pour recherche_auto.xlsx* : mise à jour du fichier précédent pour automatiser partiellement la recherche et l'extraction des photographes de la liste mentionnées dans les entrées d'annuaires.

## Documentation (*Transcription_pour recherche_auto.xlsx*)

_Description des champs du fichier csv de référence, construit à partir de la liste de (Durand,2015)_

* _secteur_ : Secteur de Paris où se trouve l'atelier (quatre secteurs répertoriés dans l'ouvrage)
* _date_ : date ou période d'activité attestée
* _nom_ : nom complet
* *nom_search_1* : nom complet (si un seul mot) ou première partie du nom (si plusieurs noms)
* *nom_search_2* : rien ou seconde partie du nom
* _prénoms_ : prénom(s)
* _numéro_ : numéro(s) dans la rue
* _rue_ : nom de la rue (ou première rue mentionnée si plusieurs)
* *numero_1_1_search* : numéro dans la rue ou premier numéro (si plusieurs)
* *numero_1_2_search* : second numéro dans la rue (si plusieurs)
* *numero_1_3_search* : troisième numéro dans la rue (si plusieurs)
* *numero_1_4_search* : quatrième numéro dans la rue (si plusieurs)
* *rue_1_search* : nom de la rue mentionnée (principale) nettoyé
* _note_ : remarques diverses fournies par l'ouvrage
* *rue_2* : nom d'une autre rue mentionnée
* *rue_2_search* : nom de la rue mentionnée (autre adresse) nettoyé
* *numero_2_1_search* : numéro associé à l'adresse secondaire