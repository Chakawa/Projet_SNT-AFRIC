const express = require('express');
const router = express.Router();
const technicianController = require('../controllers/technicianController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/demands', authMiddleware, technicianController.getAssignedDemands);

module.exports = router;