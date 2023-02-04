// On importe la bibliothèque 'multer' pour la gestion de l'upload de fichiers
const multer = require('multer');

// On définit les types de fichiers acceptés (JPG et PNG)
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// On définit les options pour le stockage des fichiers
const storage = multer.diskStorage({
  // La destination des fichiers uploadés sera le répertoire 'images'
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // Le nom de fichier sera formé à partir du nom original, avec des underscores à la place des espaces
  // et ajoutera la date courante et l'extension correspondant au type MIME
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

// On exporte la configuration pour l'upload d'un seul fichier nommé 'image'
module.exports = multer({storage: storage}).single('image');
