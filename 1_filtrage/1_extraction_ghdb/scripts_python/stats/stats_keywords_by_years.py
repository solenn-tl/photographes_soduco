"""
Statistiques sur la liste de mots-clés sélectionnés sur les différents résultats de requêtes
"""
############ LIBRARIES ##################
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
OUT_FIG = 'stats_keywords_by_years'
#Titre affiché au dessus de l'histogramme
TITRE_GRAPHE = "Evolution du nombre d'entrées par années (table : " + TAB + ")"

######################## MAIN #############################

######## I. Récupération de la liste de mots-clés

with open('keywords_list.txt','r',encoding='utf8') as f:
    res = []
    lines = f.readlines()

    for i in range(len(lines)):
        where = ''
        #Cas où on associe plusieurs mots-clés dans une même partie de la clase WHERE (ex : "chamb" et "noir" pour "Chambre noire")
        if ',' in lines[i]:
            line = lines[i].replace('\n','')
            txt = ''
            elems = line.split(',')
            for j in range (len(elems)):
                if j != len(elems)-1:
                    txt += """e.activity ILIKE '%""" + elems[j] + """%' AND """
                else:
                    txt += """e.activity ILIKE '%""" + elems[j] + """%' """
            where = txt

            #Exécution
            with engine_local.connect() as conn:
                keytab = conn.execute(text("""
                    SELECT '""" + line  +"""' AS keyword, COUNT(DISTINCT e.index) AS count, e.published 
                    FROM extractions.""" + TAB  +""" AS e 
                    WHERE """ + where + """ 
                    GROUP BY e.published 
                    ORDER BY e.published;
                        """)).fetchall()
            res.append(keytab)

        #Cas des mots seuls
        elif lines[i] != '' or lines[i] != '\n':
            line = lines[i].replace('\n','')
            where = """e.activity ILIKE '%""" + line + """%' """

            #Exécution
            with engine_local.connect() as conn:
                keytab = conn.execute(text("""
                    SELECT '""" + line  +"""' AS keyword, COUNT(DISTINCT e.index) AS count, e.published 
                    FROM extractions.""" + TAB  +""" AS e 
                    WHERE """ + where  +""" 
                    GROUP BY e.published 
                    ORDER BY e.published;
                        """)).fetchall()
            res.append(keytab)

l = sum(res,[])
df = pd.DataFrame(l,columns=['mot-clé','count','years'])
df = df.sort_values(by=['years'],ascending=True)

######## III. Création de l'histogramme
fig = px.bar(df,x='years',y='count', color='mot-clé',
                title=TITRE_GRAPHE,
                labels={'years':'années','count':"nombre d'entrées",'keyword':'mot-clé'}
                )
# Affichage
fig.show()

#Ecriture au format .pdf (statique) et au format .html (dynamique)
pio.write_image(fig, OUT_PATH+'\\'+OUT_FIG+'.pdf')
fig.write_html(OUT_PATH+'\\'+OUT_FIG+'.html')
