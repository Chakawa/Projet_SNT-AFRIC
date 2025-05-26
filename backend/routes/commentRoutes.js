const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');


// Créer un commentaire
router.post('/', commentController.create);

// Récupérer les commentaires d'une demande
router.get('/:demandeId', commentController.getByDemandeId);
router.get('/archives', authMiddleware, demandController.getArchivedDemands);
router.put('/:demandId/archive', authMiddleware, demandController.archiveDemand);

module.exports = router;

