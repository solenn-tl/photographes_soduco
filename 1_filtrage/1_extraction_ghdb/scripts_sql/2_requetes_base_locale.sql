/********************************************
*************** PARTIE 2 ********************
********************************************/
-- Création d'une nouvelle table dans laquelle les caractères spéciaux ont été supprimés + mise en minuscule de tous les caractères

DROP TABLE IF EXISTS extractions.par_activites_clean;
CREATE TABLE extractions.par_activites_clean AS (
SELECT DISTINCT par_activites.index, --DISTINCT pour enlever les lignes en double
	LOWER(REGEXP_REPLACE(REGEXP_REPLACE(par_activites.person,'^[-"“!.;,'''' :_)\s]+','\2'),'[-"“!.;,'''' :_(\s]+$','\2')) AS person,
	LOWER(REGEXP_REPLACE(REGEXP_REPLACE(par_activites.activity,'^[-"“!.;,'''' :_)\s]+','\2'),'[-"“!.;,'''' :_(\s]+$','\2')) AS activity,
	LOWER(REGEXP_REPLACE(REGEXP_REPLACE(par_activites.loc,'^[-"“!.;,'''' :_)\s]+','\2'),'[-"“!.;,'''' :_(\s]+$','\2')) AS loc,
	LOWER(REGEXP_REPLACE(REGEXP_REPLACE(par_activites.cardinal,'^[-"“!.;,'''' :_)\s]+','\2'),'[-"“!.;,'''' :_(\s]+$','\2')) AS cardinal,
	LOWER(REGEXP_REPLACE(REGEXP_REPLACE(par_activites.title,'^[-"“!.;,'''' :_)\s]+','\2'),'[-"“!.;,'''' :_(\s]+$','\2')) AS title,
	par_activites.precise_geo_response,
	par_activites.precise_geom_wkt,
	par_activites.directory,
	par_activites.published
FROM extractions.par_activites); 
		
-- Création d'une colonne "Adresse"
ALTER TABLE extractions.par_activites_clean
	ADD COLUMN address text;

-- Remplissage de la colonne adresse en fonction des valeurs des champs loc (nom de la voie) et cardinal (numéro dans la voie)
UPDATE extractions.par_activites_clean
SET address = 
     CASE 
		WHEN loc IS null AND cardinal IS null THEN null
		WHEN loc IS null AND cardinal IS NOT null THEN cardinal
		WHEN loc IS NOT null AND cardinal IS null THEN loc
		ELSE CONCAT(loc,' ',cardinal)
	 END;
	 
/********************************************
*************** PARTIE 3 ********************
********************************************/

--Création d'un schéma pour les données à extraire de r2rml
CREATE SCHEMA subsets_r2rml;

-- Création d'une nouvelle table qui contient un sous-ensemble d'entrées avec les mots clés les plus pertinents : photo, daguer et opti
DROP TABLE IF EXISTS subsets_r2rml.par_activites_photo_daguer_opti_notitle_nonul;
CREATE TABLE subsets_r2rml.par_activites_photo_daguer_opti_notitle_nonul AS (
	SELECT DISTINCT e.index, e.person, e.activity, e.address, e.loc, e.cardinal, e.precise_geo_response, e.precise_geom_wkt, e.directory, e.published
	FROM extractions.par_activites_clean AS e
	-- WHERE utile uniquement dans le cas où on procède à un second filtrage des entrées par mot-clé (comme dans le cas des photographes)
	WHERE (activity ILIKE '%photo%' OR activity ILIKE '%daguer%' OR activity ILIKE '%opti%')
	AND person IS NOT null
	AND address IS NOT null);

-- Nettoyage des chaînes de caractères vide
UPDATE subsets_r2rml.par_activites_photo_daguer_opti_notitle_nonul
	SET person =
		CASE person
			WHEN '' THEN null
			ELSE person
		END;
		
UPDATE subsets_r2rml.par_activites_photo_daguer_opti_notitle_nonul
	SET activity =
		CASE activity
			WHEN '' THEN null
			ELSE activity
		END;
		
UPDATE subsets_r2rml.par_activites_photo_daguer_opti_notitle_nonul
	SET address =
		CASE address
			WHEN '' THEN null
			ELSE address
		END;
		
---- Ajout d'un attribut unique qui servira d'URI à la ressource
ALTER TABLE subsets_r2rml.par_activites_photo_daguer_opti_notitle_nonul
	ADD COLUMN unique_id serial;