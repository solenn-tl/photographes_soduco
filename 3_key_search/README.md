# 3. Recherche de clés pour le liage des entrées

Les clés sont des combinaisons de propriétés qui assurent l'unicité d'une ressource au sein d'un jeu de données. Si deux ressources de deux annuaires différents présentent des valeurs de clés identiques, alors on peut supposer qu'elles désignent la même entité du monde réel. Les clés sont déclarées dans l'ontologie qui décrit les classes et propriétés du jeu de données des annuaires avec la propriété *hasKey*.

## Définitions

* **Clé** : combinaison de propriétés ;
* **N-Quasi-clé** : N instances partagent les mêmes valeurs pour une combinaison de propriétés donnée ;
* **N-Non-clé** : combinaison maximale de propriétés qui n'assure pas l'unicité d'une ressource à N exceptions près ;

## Outil

* [Sakey](https://lahdak.lri.fr/?q=content/sakey) : outil de détection automatique les clés dans un jeu de données.

## Paramétrage de Sakey

Ligne de commande pour exécuter Sakey : 
*java -jar sakey.jar  chemin-du-fichier.nt 1*
Avec :
* *chemin-du-fichier.nt* : fichier RDF contenant les données au format .nt
* Nombre maximal d'exceptions autorisées (redondance) : 1

Pour déterminer les clés du jeu de données des annuaires, exécution de Sakey sur une année d'extraction d'annuaires (1856) comprennant les propriétés suivantes : _label_, _activity_, _address_ (concaténation des entités LOC et CARDINAL), _numEntry_ et _directoryName_.
Les titres ont été écartés car ils comprennent trop d'erreurs liées à l'OCRisation des symboles.

La recherche de clés sur les données d'une année est pertinente car théoriquement, une entrée n'apparaît qu'une seule fois par liste. Si une entrée apparaît plusieurs fois : 
* soit l'annuaire comporte plusieurs listes (un index par noms et un index par rues par exemple) et donc autant d'entrées relatives au même commerce dotées d'entités nommées identiques  ;
* soit l'entrée apparait plusieurs fois dans la même liste (même propriétaire pour plusieurs commerces différents ou avec plusieurs adresses ?, erreur de l'éditeur ?, erreur de transcription ?). 

Les 1-quasi-clés ou 2-quasi-clés peuvent donc constituer des critères de liages acceptables.

Le fichier *subset_photo_1856.nt* peut être utilisé pour visualiser les résultats obtenus.

## Résultats

<table>
    <thead>
        <tr>
            <th colspan="4">1-Quasi clés</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>label</b></td>
            <td><b>activity</b></td>
        </tr>
        <tr>
            <td><b>label</b></td>
            <td><b>address</b></td>
        </tr>
        <tr>
            <td><b>address</b></td>
            <td><b>activity</b></td>
        </tr>
    </tbody>
</table>

<table>
    <thead>
        <tr>
            <th colspan="3">Clés</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>label</td>
            <td>activity</td>
            <td>address</td>
        </tr>
        <tr>
            <td>numEntry</td>
            <td>address</td>
            <td>activity</td>
        </tr>
    </tbody>
</table>

## Définitions des propriétés _hasKey_ pour l'ontologie

Les résultats fournis par Sakey sont utilisés pour définir les propriétés _hasKey_ dans l'ontologie pour inférer des liens de correspondance entre entrées de d'annuaires successifs représentant un même commerce. Il s'agit de choisir des clés qui permettent de lier une entrée relative à la même personne ou à une succession de personnes dans un même local de travail.
Le liage est réalisé à l'échelle de l'ensemble des annuaires (on n'utilise donc pas la propriété _directoryName_).

Les clés définies sont :
* **_numEntry_** : lie d'office les ressources qui sont issues de la même entrée (ex. cas où on a deux adresses différentes pour un commerce);
* **_label_ - _activity_** : lie les ressources qui partagent la même raison sociale et la même profession ; 
* **_label_ - _address_** : lie les ressources qui partagent la même raison sociale et ont la même adresse ;
* **_activity_ - _address_** : lie les ressources qui partagent la même description d'activité et la même adresse.

## Réutilisation

Dans le cadre du projet SoDUCo, les clés identifiées pour le cas des photographes peuvent être réutilisées pour d'autres cas d'application.

## Références

* Fatiha Saïs. *Knowledge Graph Refinement: Link Detection, Link Invalidation, Key Discovery and Data Enrichment.* Computer Science [cs]. Université Paris Sud, 2019. [.tel-02441156.](https://hal.archives-ouvertes.fr/tel-02441156)
