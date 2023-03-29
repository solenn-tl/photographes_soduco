import sqlalchemy as db

#PARAMS
dbschema='directories'
user = '' #Utilisateur
mdp='' #Mot de passe
host='geohistoricaldata.org'
port='5432'
bdd='soduco'

#Geohistoricaldata BDD CONNEXION
engine_ghd = db.create_engine('postgresql+psycopg2://' + user + ':' + mdp + '@' + host + ':' + port + '/' + bdd,
    connect_args={'options': '-csearch_path={}'.format(dbschema)})
conn_ghd = engine_ghd.connect()