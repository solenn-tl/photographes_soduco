# Silk (lignes de commande)

## Pré-requis

* Java 8

## Fichier de configuration

La chaîne de traitement Silk est configurée sous la forme d'un fichier XML.
La structure globale du fichier est la suivante :
```
<Silk>
    <Prefixes>
    <!--LISTE DES PREFIXES RDF-->
    </Prefixes>
    <DataSources>
    <!--LISTE DES DATASETS-->
    </DataSources>
    <Interlinks>
    <!--CHAINE DE TRAITEMENT-->
    <!--RESULTATS-->
    </Interlinks>
</Silk>
```

Les fichiers de configurations utilisés pour le cas de l'appariement des entrées d'annuaires relatives aux photographes se trouvent dans *5_methode_numerique/1_appariement_annuaires_annuaires*.

Pour réutiliser ces fichiers pour d'autres cas d'études du projet SoDUCo, il faut *a minima* modifier l'adresse du répertoire GraphDB où se trouvent vos données.

## Lancer Silk

Structure du dossier<br/>
<img src="https://github.com/solenn-tl/photographes_soduco/blob/main/doc/images/SilkLigneCommande.png" width="600" text-align="center"/>

1. Ouvrir une invite de commande dans le dossier où se trouve silk.jar et le fichier de configuration.
<img src="https://github.com/solenn-tl/photographes_soduco/blob/main/doc/images/inviteDeCommande.png" width="800" text-align="center"/>

2. Ecrire la commande suivante dans l'invite de commande (en adaptant les paramètres ci-dessous)

```
java -XmsXg -XmxXg -DconfigFile=config.xml -jar silk.jar
```

Avec 
* Xms : mémoire RAM minimale allouée au programme
* Xmx : mémoire RAM maximale allouée au programme (pas plus de 3/4 de la mémoire totale disponible)
* DconfigFile : nom du fichier de configuration (.xml)

Exemple :
```
java -Xms5g -Xmx6g -DconfigFile=appariement_Annuaires.xml -jar silk.jar
```

## Entrées / Sorties

* Entrée : Répertoire Graph DB (sans raisonneur ni ontologie) OU fichier RDF (local)
* Sortie : Fichier RDF, format N-Triple *.nt*

## Erreurs possibles

* Trouver et installer la bonne version de Java correspondant à la bonne version de Silk.
* Mémoire de l'ordinateur insuffisante (Java Heap Size).