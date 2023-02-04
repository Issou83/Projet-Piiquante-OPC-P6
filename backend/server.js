//Importation du package HTTP natif de Node
const http = require('http');

//Importation d'Express dans le serveur
const app = require('./app');

/*La methode set d'express sera utilisé à chaque appel effectué vers ce serveur*/
app.set('port', process.env.PORT || 3000);
const server = http.createServer(app)

/*Ecoute du serveur 
-Soit par la variable d'environnement du port grace à "process.env.PORT": 
 si la plateforme de déploiement propose un port par défaut, c'est celui-ci qu'on écoutera
-Soit le port 3000, ce qui nous servira dans le cas de notre plateforme de développement.*/
server.listen(process.env.PORT || 3000);