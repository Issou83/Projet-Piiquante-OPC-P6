//On importe Express car il detient la fonction router
const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');

const saucesCtrl = require('../controllers/sauces')

router.post('/', auth, multer, saucesCtrl.createSauces);

router.post('/:id/like', auth, saucesCtrl.likeSauces)

router.put('/:id', auth, multer, saucesCtrl.modifySauces);

router.delete('/:id', auth, saucesCtrl.deleteSauces);

router.get('/:id', auth, saucesCtrl.getOneSauces);

router.get('/', auth, saucesCtrl.getALLSauces);

module.exports = router;
