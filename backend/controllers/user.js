const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Cette fonction permet de créer un nouvel utilisateur
exports.signup = (req, res, next) => {
  // Chiffrer le mot de passe de l'utilisateur à l'aide de bcrypt
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      // Créer un nouvel objet utilisateur avec l'email et le mot de passe chiffré
      const user = new User({
        email: req.body.email,
        password: hash
      });
      // Sauvegarder l'utilisateur dans la base de données
      user.save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Cette fonction permet à un utilisateur de se connecter
exports.login = (req, res, next) => {
  // Trouver l'utilisateur dans la base de données en utilisant l'email fourni
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        // Si aucun utilisateur n'a été trouvé avec cet email, renvoyer un message d'erreur
        return res.status(401).json({ message: "Paire identifiant/mot de passe incorecte" });
      }
      // Comparer le mot de passe entré avec le mot de passe chiffré stocké dans la base de données
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            // Si les mots de passe ne correspondent pas, renvoyer un message d'erreur
            return res.status(401).json({ message: "Paire identifiant/mot de passe incorecte" });
          }
            // Si les mots de passe correspondent, renvoyer un jeton JSON Web Token avec l'ID de l'utilisateur et une durée de vie de 24 heures
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                {userId: user._id},
                process.env.TOKEN,
                {expiresIn: '24h'}
              )
            });
          
        })
        .catch(error => res.status(500).json({ error }));
      
    })
    .catch(error => res.status(500).json({ error }));
  
};
