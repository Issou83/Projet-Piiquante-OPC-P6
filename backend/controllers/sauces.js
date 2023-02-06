const Sauces = require("../models/Sauces");
const fs = require("fs");

exports.createSauces = (req, res, next) => {
  // Récupération des données envoyées par l'utilisateur dans le corps de la requête
  const saucesObject = JSON.parse(req.body.sauce);

  // Suppression de l'_id et de l'_userId qui ne doivent pas être enregistrés dans la base de données
  delete saucesObject._id;
  delete saucesObject._userId;

  // Construction de l'objet sauce à enregistrer dans la base de données
  const sauces = new Sauces({
    ...saucesObject, // Copie des propriétés du saucesObject
    _userId: req.auth.userId, // Ajout de l'_userId provenant de l'utilisateur authentifié
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`, // Ajout de l'URL de l'image
  });

  // Enregistrement de l'objet sauce dans la base de données
  sauces
    .save()
    .then(() => {
      // En cas de succès, renvoie un statut 201 et un message de confirmation
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      // En cas d'erreur, renvoie un statut 400 et l'erreur
      res.status(400).json({ error });
    });
};




// Cette fonction est exportée pour être utilisée en tant que controlleur pour modifier une sauce dans la base de données.
exports.modifySauces = (req, res, next) => {
    // Récupère l'ID de la sauce à partir des paramètres de la requête.
    const sauceId = req.params.id;
     // Si une nouvelle image a été téléchargée avec la requête, la ajoute à l'objet "sauceObject".
        // Sinon, ajoute simplement les autres données de la requête à l'objet "sauceObject".
        //L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
        const saucesObject = req.file ? {
          //L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
        ...JSON.parse(req.body.sauce), 
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
      : { ...req.body };

      // Supprime la propriété "_userId" de l'objet "sauceObject".
      delete saucesObject._userId;
    // Trouve la sauce dans la base de données en utilisant son ID.
    Sauces.findOne({ _id: sauceId })


      .then((sauce) => {
        // Si aucune sauce n'a été trouvée, renvoie une erreur 404 avec un message d'erreur.
        if (sauce.userId != req.auth.userId) {
          return res.status(404).json({ error: "Sauce inéxistante" });

        } else if (req.file) {
          const filename = sauce.imageUrl.split("/images/")[1]
          fs.unlink(`images/${filename}`, error => {
            if (error) 
            throw error
          })
        }

          Sauces.updateOne(
            { _id: sauceId },
            { ...saucesObject, _id: sauceId }
          )
            .then(() => {
              // Renvoie un message de succès si la mise à jour a réussi.
              res.status(200).json({ message: "Votre sauce à bien été modifiée " });
            })
            .catch((error) => {
              // Renvoie une erreur si la mise à jour a échoué.
              res.status(401).json({ error });
            });
        // }

  
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};


exports.deleteSauces = (req, res, next) => {
    // Cherche la sauce en base de données avec l'ID spécifié dans la requête
    Sauces.findOne({ _id: req.params.id })
      .then((Sauces) => {
        // Vérifie si l'utilisateur actuel est autorisé à supprimer la sauce
        if (Sauces.userId != req.auth.userId) {
          // Envoie un message d'erreur 401 si l'utilisateur n'est pas autorisé
          res.status(401).json({ message: "Not authorized" });
        } else {
          // Détermine le nom de fichier de l'image de la sauce
          const filename = Sauces.imageUrl.split("/images/")[1];
          // Supprime le fichier de l'image de la sauce
          fs.unlink(`images/${filename}`, () => {
            // Supprime la sauce de la base de données
            Sauces.deleteOne({ _id: req.params.id })
              .then(() => {
                // Envoie un message de succès 200
                res.status(200).json({ message: "Sauce supprimé !" });
              })
              .catch((error) => 
                // Envoie un message d'erreur 401 en cas d'erreur
                res.status(401).json({ error })
              );
          });
        }
      })
      .catch((error) => {
        // Envoie un message d'erreur 500 en cas d'erreur
        res.status(500).json({ error });
      });
  };

exports.getOneSauces = (req, res, next) => {
// Cherche la sauce en base de données avec l'ID spécifié dans la requête
  Sauces.findOne({ _id: req.params.id })
 // Envoie un message d'erreur 404 en cas d'erreur
    .then((sauces) => res.status(200).json(sauces))
    // Envoie un message d'erreur 404 en cas d'erreur
    .catch((error) => res.status(404).json({ error }));
};

exports.getALLSauces = (req, res, next) => {
// Cherche toutes les sauces en base de données
  Sauces.find()
   // Envoie toutes les sauces trouvées dans la réponse
    .then((sauces) => res.status(200).json(sauces))
    // Envoie un message d'erreur 400 en cas d'erreur
    .catch((error) => res.status(400).json({ error }));
};

// Exportation de la fonction "likeSauces" pour être utilisée en dehors de ce fichier
exports.likeSauces = (req, res) => {
  // Utilisation de la méthode "findOne" de la bibliothèque "Sauces" pour trouver une sauce en utilisant l'ID fourni dans la requête
  Sauces.findOne({ _id: req.params.id })
    .then((sauces) => {
      // Vérification de la valeur "like" envoyée dans la requête
      // Si la valeur est égale à 1, cela signifie que l'utilisateur a aimé la sauce
      if (req.body.like === 1) {
        // Incrémenter le nombre de "likes" pour la sauce trouvée
        sauces.likes++;
        // Ajouter l'ID de l'utilisateur à la liste "usersLiked" de la sauce
        sauces.usersLiked.push(req.body.userId);
        // Enregistrer les modifications dans la base de données
        sauces.save();
      }
      // Si la valeur est égale à -1, cela signifie que l'utilisateur n'a pas aimé la sauce
      if (req.body.like === -1) {
        // Incrémenter le nombre de "dislikes" pour la sauce trouvée
        sauces.dislikes++;
        // Ajouter l'ID de l'utilisateur à la liste "usersDisliked" de la sauce
        sauces.usersDisliked.push(req.body.userId);
        // Enregistrer les modifications dans la base de données
        sauces.save();
      }
      // Si la valeur est égale à 0, cela signifie que l'utilisateur a annulé son vote
      if (req.body.like === 0) {
        // Vérifier si l'ID de l'utilisateur se trouve dans la liste "usersLiked"
        if (sauces.usersLiked.indexOf(req.body.userId) != -1) {
          // Si oui, décrémenter le nombre de "likes" pour la sauce
          sauces.likes--;
          // Supprimer l'ID de l'utilisateur de la liste "usersLiked"
          sauces.usersLiked.splice(
            sauces.usersLiked.indexOf(req.body.userId),
            1
          );
        } else {
          // Si non, décrémenter le nombre de "dislikes" pour la sauce
          sauces.dislikes--;
          // Supprimer l'ID de l'utilisateur de la liste "usersDisliked"
          sauces.usersDisliked.splice(
            sauces.usersDisliked.indexOf(req.body.userId),
            1
          );
        }
        sauces.save();
      }
      // Renvoie un message de succès avec un statut HTTP 200
      res.status(200).json({ message: "like modifié" });
    })
    .catch((error) => {
      // Si une erreur se produit, renvoie un message d'erreur avec un statut HTTP 500
      res.status(500).json({ error });
    });
};
