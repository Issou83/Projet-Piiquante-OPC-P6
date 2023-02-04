//Importation du package HTTP natif de Node

const http = require('http');

/*Fonction qui sera exécutée à chaque appel effectué vers ce serveur
Elle reçoit les objets request et response en tant qu'arguments*/
const server = http.createServer((req, res) => {
    res.end('Voilà la réponse du serveur !');
});

/*Ecoute du serveur 
-Soit par la variable d'environnement du port grace à "process.env.PORT": 
 si la plateforme de déploiement propose un port par défaut, c'est celui-ci qu'on écoutera
-Soit le port 3000, ce qui nous servira dans le cas de notre plateforme de développement.*/
server.listen(process.env.PORT || 3000);