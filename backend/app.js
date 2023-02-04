const express = require('express');
const mongoose = require('mongoose');
const app = express();
//Gérer la requête venant de l'application front-end, on a besoin d'en extraire le corps JSON
app.use(express.json());


// On se connecte à la base de données MongoDB
mongoose.connect("mongodb+srv://issou:8383@cluster0.k4dphx2.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));




/*Pour permettre des requêtes cross-origin (et empêcher des erreurs CORS), des headers spécifiques de 
contrôle d'accès doivent être précisés pour tous vos objets de réponse.*/

/*Le CORS définit comment les serveurs et les navigateurs interagissent, en spécifiant quelles 
ressources peuvent être demandées de manière légitime – par défaut, les requêtes AJAX sont interdites.

Configurer les bons headers sur l'objet réponse permet l'envoi et la réception de requêtes et de réponses sans erreurs CORS.*/

// On autorise les requêtes CORS (Cross-Origin Resource Sharing) depuis n'importe quelle origine
//Le middleware ne prend pas d'adresse en premier paramètre, afin de s'appliquer à toutes les routes
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
  });


  app.post('/api/stuff', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
      message: 'Objet créé !'
    });
  });


module.exports = app;