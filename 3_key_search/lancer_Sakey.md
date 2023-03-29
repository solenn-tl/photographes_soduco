# Sakey

## Etapes

1. Préparer un fichier contenant les ressources nécessaire à la détection des clés
2. Se placer dans le dossier où se trouver le fichier RDF contenant les ressources.
3. Ouvrir une invite de commande
4. Exécuter la commande 
```
java -jar chemin\sakey.jar  chemin\fichier-ressources-RDF-a-utiliser.nt NOMBRE_MAX_EXCEPTIONS
```

## Exemple

Dans le dossier où se trouve le fichier *subset_photo_1856.nt*.

```
java -jar C:\Sakey\sakey.jar  subset_photo_1856.nt 1
```