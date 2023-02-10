// On importe les bibliothèques 'express', 'body-parser', 'mongoose', 'path'
const express = require("express");
const bodyParser = require("body-parser");

//Package qui permet d'acceder au variables d'environnements
const dotenv = require("dotenv");
dotenv.config({
  path: ".env"
});



/*Mongoose est un package qui facilite les interactions avec notre base de données MongoDB. 
Il nous permet de :
*valider le format des données ;
*gérer les relations entre les documents ;
*communiquer directement avec la base de données pour la lecture et l'écriture des documents.*/

//Le package Mongoose facilite les interactions entre votre application Express et votre base de données MongoDB.
const mongoose = require("mongoose");

const userRoutes = require('./routes/user');
const saucesRoutes = require("./routes/sauces");
const path = require('path');
const morgan = require("morgan");

// On initialise l'application express
const app = express();

app.use(morgan("dev"))
// On se connecte à la base de données MongoDB
mongoose.connect(process.env.MONGO_DB,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

/*-------------------------------------------------------------------------------------------------------*/  
//La méthode app.use() vous permet d'attribuer un middleware à une route spécifique de votre application.


/*Avec ceci, Express prend toutes les requêtes qui ont comme 
//Content-Type  application/json  et met à disposition leur  body  directement sur l'objet req*/
app.use(express.json());


/*Pour permettre des requêtes cross-origin (et empêcher des erreurs CORS), des headers spécifiques de 
contrôle d'accès doivent être précisés pour tous vos objets de réponse.*/

/*Le CORS définit comment les serveurs et les navigateurs interagissent, en spécifiant quelles 
ressources peuvent être demandées de manière légitime – par défaut, les requêtes AJAX sont interdites.

Configurer les bons headers sur l'objet réponse permet l'envoi et la réception de requêtes et de réponses sans erreurs CORS.*/

// On autorise les requêtes CORS (Cross-Origin Resource Sharing) depuis n'importe quelle origine
//Le middleware ne prend pas d'adresse en premier paramètre, afin de s'appliquer à toutes les routes
//bloque les connection qui n'ont pas la meme origine
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next(); 
});

// On expose le répertoire 'images' pour les requêtes HTTP
app.use('/images', express.static(path.join(__dirname, 'images')));

// On utilise les routes définies pour les sauces et l'authentification
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

// On utilise le parseur de corps de requête pour extraire les données JSON
app.use(bodyParser.json());

// On exporte l'application express
module.exports = app;
