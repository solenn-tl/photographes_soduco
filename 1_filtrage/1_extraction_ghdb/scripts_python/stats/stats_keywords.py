"""
Statistiques sur la liste de mots-clés sélectionnés sur les différents résultats de requêtes
"""
from connect.local_db import engine_local
from sqlalchemy import text
import pandas as pd
import plotly.express as px
import plotly.io as pio

#########################################
################ PARAMS #################
#########################################
#Paramètres à définir avant de lancer le script

#Table de la base de données locale utilisée
TAB = 'par_activites'
#Dossier où écrire le résultat
OUT_PATH = 'C:\\Users\\stual\\Documents\\STAGE\\photographes_soduco\\1_filtrage\\2_stats'
#Nom des fichiers résultats
OUT_FIG = 'stats_keywords_' + TAB
#Titre affiché au dessus de l'histogramme
TITRE_GRAPHE = "Nombre d'entrées par mot-clé (table : " + TAB + ")"

#########################################
################ MAIN ###################
#########################################

with open('keywords_list.txt','r',encoding='utf8') as f:
    keywords = f.readlines()

counts = []
with engine_local.connect() as conn:
    for keyword in keywords:
        if type(keyword) == type(str()) and keyword != '\n' and ',' not in keyword:
            keyword = keyword.replace('\n','')
            result = conn.execute(text("""
            SELECT COUNT(DISTINCT tab.index) AS count
            FROM extractions.""" + TAB + """ AS tab
            WHERE tab.activity ILIKE '%""" + keyword + """%';
            """)).fetchall()
            counts.append(result[0][0])
        elif type(keyword) == type(str()) and keyword != '\n' and ',' in keyword:
            parts_of_keyword = keyword.split(',')
            where = """ tab.activity ILIKE '%""" + keyword[0] + """%'"""
            for key in keyword[1:]:
                where += """ AND tab.activity ILIKE '%""" + key + """%'"""
            result = conn.execute(text("""
                        SELECT COUNT(DISTINCT tab.index) AS count
                        FROM extractions.""" + TAB + """ AS tab
                        WHERE """ + where + """;"""
                        )).fetchall()
            counts.append(result[0][0])

#Création du dataframe utilisé pour créer l'histogramme
data = []
for i in range(len(counts)):
    data.append([keywords[i],counts[i]])
df = pd.DataFrame(data,columns=['labels','counts'])
df = df.sort_values(by=['counts'],ascending=False)

######## III. Création de l'histogramme
fig = px.bar(df, x='labels',y='counts',
                   title="Nombre d'entrées par mot-clé (table : " + TAB + ")",
                   labels={'labels':'mot-clé','counts':"nombre d'entrées"}
                   #,log_y=True
                   )
#Affichage
fig.show()
#Ecriture au format .pdf (statique) et au format .html (dynamique)
pio.write_image(fig, OUT_PATH+'\\'+OUT_FIG+'.pdf')
fig.write_html(OUT_PATH+'\\'+OUT_FIG+'.html')