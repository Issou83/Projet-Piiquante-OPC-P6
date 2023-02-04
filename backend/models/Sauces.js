const mongoose = require("mongoose");

//création du modele de données pour les sauces
//On utilise la méthode Schema mise à disposition par Mongoose
const saucesSchema = mongoose.Schema({
  userId: { type: String, required: true }, 
  name: { type: String, required: true }, 
  manufacturer: { type: String, required: true }, 
  description: { type: String, required: true }, 
  mainPepper: { type: String, required: true }, 
  imageUrl: { type: String, required: true }, 
  heat: { type: Number, required: true }, 
  likes: { type: Number, required: false, default: 0 }, 
  dislikes: { type: Number, required: false, default: 0 },
  usersLiked: { type: [String], required: false },
  usersDisliked: { type: [String], required: false }
}); 

//Méthode mongoose qui permet d'exporter le model dans notre base de donnée
module.exports = mongoose.model("Sauce", saucesSchema);

/*Ce modèle nous permettra non seulement d'appliquer notre structure de données, 
mais aussi de simplifier les opérations de lecture 
et d'écriture dans la base de données*/
