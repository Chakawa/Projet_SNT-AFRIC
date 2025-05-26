const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

// Récupérer les notifications
router.get('/', authMiddleware, async (req, res) => {
    try {
        const notifications = await notificationController.getUserNotifications(req.userId);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Nombre de notifications non lues
router.get('/unread-count', authMiddleware, async (req, res) => {
    try {
        const count = await notificationController.getUnreadCount(req.userId);
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Marquer une notification comme lue
router.put('/:id/read', authMiddleware, async (req, res) => {
    try {
        await notificationController.markNotificationAsRead(req.params.id, req.userId);
        res.json({ message: 'Notification marquée comme lue' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Marquer toutes comme lues
router.put('/mark-all-read', authMiddleware, async (req, res) => {
    try {
        await notificationController.markAllAsRead(req.userId);
        res.json({ message: 'Toutes les notifications marquées comme lues' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;