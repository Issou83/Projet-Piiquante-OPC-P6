const express = require('express');

const app = express();

//On configure une reponse, à chaque requete reçu, on renverra un message en .json
app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' }); 
 });

module.exports = app;