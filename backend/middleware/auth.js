// Importe la bibliothèque "jsonwebtoken"
const jwt = require('jsonwebtoken');

// Exporter une fonction qui s'exécutera lors de la requête entrante
module.exports = (req, res, next) => {
    // Essayer d'exécuter le code suivant
    try {
        // Récupérer le token dans les en-têtes de la requête
        const token = req.headers.authorization.split(' ')[1];
        // Décoder le token en utilisant la clé secrète "RANDOM_TOKEN_SECRET"
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // Récupérer l'ID de l'utilisateur décodé
        const userId = decodedToken.userId;
        // Ajouter l'ID de l'utilisateur dans l'objet req.auth
        req.auth = {userId: userId}
        // Passer à la prochaine étape de la chaîne de middleware
        next()
    } catch(error) {
        // Si une erreur est survenue, renvoyer une réponse d'erreur 401
        res.status(401).json({ error });
    }
};
