
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/demands', authMiddleware, adminController.getAllDemands);
router.post('/assign', authMiddleware, adminController.assignTechnician);

module.exports = router;