import sqlalchemy as db

#PARAMS
server='postgres'
dbschema='extractions' #Le schéma "exractions" doit avoir été créé au préalable dans la base de donnée locale
user='' #Username de la base de données locale
mdp='' #Mot de passe de la base de donnée locale
host='localhost'
port='5433' #Port du serveur Postgres (généralement 5432)
bdd='photographes' #Nom de la base de données

#LOCAL BDD CONNEXION
engine_local = db.create_engine('postgresql+psycopg2://' + user + ':' + server + '@' + host + ':' + port + '/' + bdd,
    connect_args={'options': '-csearch_path={}'.format(dbschema)})