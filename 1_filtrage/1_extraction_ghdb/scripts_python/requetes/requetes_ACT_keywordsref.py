"""
Requête par mots-clés dans le champ activité
Sélectionne les entrées dans Geohistorical data et copie le résultat dans une table dans une base de données locale
"""
############ LIBRARIES ##################
import time
from datetime import timedelta
import pandas as pd
from connect.connect import engine_ghd
from connect.local_db import engine_local
from sqlalchemy import text

#########################################
################ PARAMS #################
#########################################
#Paramètres à définir avant de lancer le script

#Nom de la table à créer/remplacer avec les résultats dans la base de données locale
TABLE_RESULTAT = 'par_activites_test'

#########################################
################ TOOLS ##################
#########################################

def countchar(char):
    count = 0
    for i in sentence:
        if i == char:
            count = count + 1
    return count

#########################################
################ MAIN ###################
#########################################

########### I. KEYWORDS ##################

with open('keywords_large_list.txt','r',encoding='utf8') as f:
    lines = f.readlines()
    where = ''
    for i in range(len(lines)-1):
        #Cas où on associe plusieurs mots-clés dans une même partie de la clase WHERE (ex : "chamb" et "noir" pour "Chambre noire")
        if ',' in lines[i]:
            line = lines[i].replace('\n','')
            txt = ''
            elems = line.split(',')
            for j in range (len(elems)):
                if j != len(elems)-1:
                    txt += """act.ner_xml ILIKE '%""" + elems[j] + """%' AND """
                else:
                    txt += """act.ner_xml ILIKE '%""" + elems[j] + """%'"""
            where += '(' + txt + ') OR '
        #Cas des mots seuls
        elif lines[i] != '' or lines[i] != '\n':
            line = lines[i].replace('\n','')
            where += """act.ner_xml ILIKE '%""" + line + """%' OR """
    where += """act.ner_xml ILIKE '%""" + lines[-1] + """%' """

print("Step 1 : WHERE request has been defined.")

############ II. SELECTION ###################

# Sélection des données dans la base de données SoDUCo du serveur GeoHistoricalData
with engine_ghd.connect() as conn:
    start = time.time()
    result = conn.execute(text("""
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
	WHERE ( """ + where +
		""" )
	ORDER BY e.index, e.published ASC
	LIMIT 10;
    """)).fetchall()
    end = time.time()
    t = timedelta(seconds=(end-start))
    print("Time to execute SELECT request :",t)
    df_res = pd.DataFrame(data=result,columns=['index','person','activity','loc','cardinal','title','precise_geo_response','precise_geom_wkt','directory','published'])
    print("Step 2 : SELECT request is done.")

############ III. INSERTION ###################
# Insertion de la sélection dans une base de données Postgres locale

start = time.time()
df_res = df_res.drop_duplicates(keep='first')
df_res.to_sql(TABLE_RESULTAT, engine_local, index=False, if_exists='replace',schema='extractions')
end = time.time()
t = timedelta(seconds=(end-start))
print("Time to execute CREATE TABLE request :",t)
print("Step 3 : CREATE TABLE in local database is done.")

############ IV. CREATE INDEX ###################
# Création des index sur les champs "index", "person", "activity", "loc", "precise_geo_response" et "directory"

with engine_local.connect() as conn:
    results = conn.execute(text("""
        DROP INDEX IF EXISTS idx_directories_""" + TABLE_RESULTAT + """_index ; 
        CREATE INDEX idx_directories_""" + TABLE_RESULTAT + """_index
        ON extractions.""" + TABLE_RESULTAT + """ (index);
        
        DROP INDEX IF EXISTS idx_directories_""" + TABLE_RESULTAT + """_person ; 
        CREATE INDEX idx_directories_""" + TABLE_RESULTAT + """_person
        ON extractions.""" + TABLE_RESULTAT + """ (person);
        
        DROP INDEX IF EXISTS idx_directories_""" + TABLE_RESULTAT + """_activity ; 
        CREATE INDEX idx_directories_""" + TABLE_RESULTAT + """_activity
        ON extractions.""" + TABLE_RESULTAT + """ (activity);
        
        DROP INDEX IF EXISTS idx_directories_""" + TABLE_RESULTAT + """_loc ; 
        CREATE INDEX idx_directories_""" + TABLE_RESULTAT + """_loc
        ON extractions.""" + TABLE_RESULTAT + """ (loc);
        
        DROP INDEX IF EXISTS idx_directories_""" + TABLE_RESULTAT + """_precise_geo_response ; 
        CREATE INDEX idx_directories_""" + TABLE_RESULTAT + """_precise_geo_response
        ON extractions.""" + TABLE_RESULTAT + """ (precise_geo_response);
        
        DROP INDEX IF EXISTS idx_directories_""" + TABLE_RESULTAT + """_directory ; 
        CREATE INDEX idx_directories_""" + TABLE_RESULTAT + """_directory
        ON extractions.""" + TABLE_RESULTAT + """ (directory);
        """))
print("Step 4 : CREATE INDEX requests are done.")
print(" ############ END #############")