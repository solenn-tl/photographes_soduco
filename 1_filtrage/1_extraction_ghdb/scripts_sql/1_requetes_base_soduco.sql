/********************************************
*************** PARTIE 1 ********************
********************************************/
-- Sélectionne les entrées dont le champs activité contient les mots-clés déterminés au préalable
-- Les entrées qui contiennent plusieurs entités de type PER (raison sociale) sont écartées pour éliminer les erreurs de segmentation (outil de traitement d'image) => ligne de la base qui contiennent en réalité plusieurs entrées

-- !!!!!!!!!!!!!!!!! AVERTISSEMENT A LIRE !!!!!!!!!!!!!!!!!!!!!

-- ATTENTION : la partie 1 ne doit être utilisée directement que si vous avez l'autorisation d'écrire dans la base SoDUCo.
-- Si vous travaillez directement dans la base SoDUCo : executez successiement les 3 parties de ce fichier.
-- Si vous souhaitez travailler en local : voir le code Python dans le dossier database/requetes/requetes_ACT_keywordsref.py (et database/connect/) pour faire la partie 1

/*Création d'un schéma pour stocker les résultats brutes du filtrage*/
CREATE SCHEMA extractions;

/*Création de la table contenant les résultats du filtrage "Par activités" dans le schéma "Extractions"*/
DROP TABLE IF EXISTS extractions.par_activites;

CREATE TABLE extractions.par_activites AS (
	--Pour chaque entrée, compte le nombre de '<PER>' dans la chaîne XML retournée par la pipeline NER
	WITH per_count AS (
			SELECT e.index, (length(e.ner_xml) - length(replace(e.ner_xml, '<PER>', '' ))) / length('<PER>') AS count_
			FROM directories.elements AS e
			ORDER BY count_ DESC
		), short_list AS ( --Ne conserve que les entrées avec 0 ou 1 PER (au delà, on aura un produit cartésien de tous les attributs)
			SELECT pc.index
			FROM per_count AS pc
			WHERE count_ <=1)
	SELECT DISTINCT e.index, p.ner_xml AS person, act.ner_xml AS activity, s.loc AS loc, s.cardinal AS cardinal,
	t.ner_xml AS title, g."precise.geo_response" AS precise_geo_response, g."precise.geom" AS precise_geom_wkt, e.directory, e.published
	FROM short_list AS l
	INNER JOIN directories.elements AS e ON l.index = e.index
	INNER JOIN directories.persons AS p ON e.index = p.entry_id
	INNER JOIN directories.activities AS act ON e.index = act.entry_id
	INNER JOIN directories.addresses AS s ON e.index = s.entry_id
	INNER JOIN directories.titles AS t ON e.index = t.entry_id
	INNER JOIN directories.geocoding AS g ON e.index = g.entry_id
	WHERE (
		-- Liste des mots-clés
		act.ner_xml ILIKE '%photo%' OR 
		act.ner_xml ILIKE '%daguer%' OR 
		act.ner_xml ILIKE '%opti%' OR 
		act.ner_xml ILIKE '%litho%' OR 
		act.ner_xml ILIKE '%grav%' OR 
		act.ner_xml ILIKE '%artiste%' OR 
		act.ner_xml ILIKE '%mesure%' OR 
		act.ner_xml ILIKE '%appareil%' OR
		act.ner_xml ILIKE '%math%' OR 
		act.ner_xml ILIKE '%physi%' OR 
		act.ner_xml ILIKE '%ingenieur%' OR 
		act.ner_xml ILIKE '%lentil%' OR 
		(act.ner_xml ILIKE '%chamb%' AND act.ner_xml ILIKE '%noir%') OR 
		act.ner_xml ILIKE '%imag%' OR 
		act.ner_xml ILIKE '%lunet%' OR 
		act.ner_xml ILIKE '%prisme%' OR
		act.ner_xml ILIKE '%cinem%' OR
		act.ner_xml ILIKE '%camera%' OR
		act.ner_xml ILIKE '%chimi%' OR
		act.ner_xml ILIKE '%portr%'
		)
	ORDER BY e.index, e.published ASC);