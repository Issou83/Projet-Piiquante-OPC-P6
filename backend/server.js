//Importation du package HTTP natif de Node 
//Require nous permet d'omettre l'extension .js
const http = require('http');

//Importation d'Express dans le serveur
const app = require('./app');

//Renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
    const port = parseInt(val, 10)

    // Si la valeur n'est pas un nombre, renvoyer la valeur telle quelle
    if (isNaN(port)) {
        return val;
    }
    // Si le port est supérieur ou égal à zéro, renvoyer le port
    if (port >= 0) {
        return port;
    }
    // Sinon, renvoyer false
    return false;
}

// Définition du port à utiliser pour le serveur
//Si l'environnement sur lequel tourne le server definit le port/Sinon le port 3000 sera utilisé
const port = normalizePort(process.env.PORT || '3000')

// Définition du port pour l'application
app.set('port', port);

// Fonction pour gérer les erreurs du serveur
/*Elle recherche les différentes erreurs et les gère de manière appropriée. 
Elle est ensuite enregistrée dans le serveur*/
const errorHandler = error => {
    // Si l'erreur n'est pas liée à l'écoute, lancer une erreur
    if (error.syscall !== 'listen') {
    throw error;
}
const address = server.address();
const bind = typeof address === 'string' ? 'pipe ' + address : 'port:' + port;
// Selon le code d'erreur, afficher un message d'erreur et terminer le processus
switch (error.code) {
    case 'EACCES':
        console.error(bind + ' nécessite des privilèges élevés.');
        process.exit(1);
        break;
    case 'EADDRINUSE':
        console.error(bind + ' est déjà utilisé.');
        process.exit(1);
        break;
    default:
        throw error;
}
};

// Création du serveur HTTP
const server = http.createServer(app);

// En cas d'erreur, appeler la fonction errorHandler
server.on('error', errorHandler);

/* Écouter les événements "listening", également enregistré, 
consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console*/
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port' + port;
    // Afficher un message indiquant que le serveur écoute sur le port spécifié
    console.log('Ecoute sur le ' + bind);
})

// Démarrage du serveur sur le port spécifié
server.listen(port);

