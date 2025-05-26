const express = require('express');
const router = express.Router();
const demandController = require('../controllers/demandController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, demandController.createDemand);
router.get('/', authMiddleware, demandController.getDemands);

// 🔄 Mettre à jour statut
router.put('/:demandId/status', authMiddleware, demandController.updateDemandStatus);

// ❌ Supprimer une demande
router.delete('/:demandId', authMiddleware, demandController.deleteDemand);

// 📥 Archiver une demande
router.put('/:demandId/archive', authMiddleware, demandController.archiveDemand);

module.exports = router;
