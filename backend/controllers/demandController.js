const db = require('../config/db');
const { createNotification } = require('./notificationController');
const { Demande } = require('../models');

// ✅ Créer une demande
exports.createDemand = async (req, res) => {
    try {
        const { serviceId, typeDemande, adresse, disponibilite, creneauHoraire, details } = req.body;
        const userId = req.userId;

        const [result] = await db.execute(
            'INSERT INTO demandes (user_id, service_id, type_demande, adresse, disponibilite, creneau_horaire, details) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, serviceId, typeDemande, adresse, disponibilite, creneauHoraire, details]
        );

        await createNotification(
            1,
            'Nouvelle demande créée',
            `Une nouvelle demande de type ${typeDemande} a été créée par l'utilisateur ${userId}`,
            'demande',
            `/admin/demandes/${result.insertId}`
        );

        res.status(201).json({ 
            message: 'Demande créée avec succès',
            demandId: result.insertId
        });
    } catch (error) {
        console.error('Create demand error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ✅ Lire les demandes de l'utilisateur (sans les archivées)
exports.getDemands = async (req, res) => {
    try {
        const userId = req.userId;

        const [demands] = await db.execute(
            'SELECT * FROM demandes WHERE user_id = ? AND archive = FALSE',
            [userId]
        );

        res.json(demands);
    } catch (error) {
        console.error('Get demands error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ✅ Mettre à jour le statut
exports.updateDemandStatus = async (req, res) => {
    try {
        const { demandId } = req.params;
        const { status } = req.body;

        await db.execute(
            'UPDATE demandes SET statut = ? WHERE id = ?',
            [status, demandId]
        );

        const [demand] = await db.execute(
            'SELECT user_id, reference, statut FROM demandes WHERE id = ?',
            [demandId]
        );

        if (demand.length === 0) {
            return res.status(404).json({ message: 'Demande non trouvée' });
        }

        const demandData = demand[0];

        if (status === 'en_cours') {
            await createNotification(
                demandData.user_id,
                'Demande en cours',
                `Votre demande #${demandData.reference} est en cours de traitement`,
                'demande',
                `/demandes/${demandId}`
            );
        } else if (status === 'termine') {
            await createNotification(
                demandData.user_id,
                'Demande terminée',
                `Votre demande #${demandData.reference} a été marquée comme terminée`,
                'demande',
                `/demandes/${demandId}`
            );
            await createNotification(
                1,
                'Demande terminée',
                `La demande #${demandData.reference} a été terminée`,
                'demande',
                `/admin/demandes/${demandId}`
            );
        }

        res.json({ message: 'Statut mis à jour avec succès' });
    } catch (error) {
        console.error('Update demand status error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ✅ Supprimer une demande
exports.deleteDemand = async (req, res) => {
    try {
        const { demandId } = req.params;

        await db.execute('DELETE FROM demandes WHERE id = ?', [demandId]);
        res.json({ message: 'Demande supprimée avec succès' });
    } catch (error) {
        console.error('Delete demand error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ✅ Archiver une demande
exports.archiveDemand = async (req, res) => {
    try {
        const { demandId } = req.params;

        await db.execute('UPDATE demandes SET archive = TRUE WHERE id = ?', [demandId]);
        res.json({ message: 'Demande archivée avec succès' });
    } catch (error) {
        console.error('Archive demand error:', error);
        res.status(500).json({ error: error.message });
    }
};
exports.getArchivedDemands = async (req, res) => {
    try {
        const [demands] = await db.execute(
            'SELECT * FROM demandes WHERE archive = TRUE'
        );

        res.json(demands);
    } catch (error) {
        console.error('Get archived demands error:', error);
        res.status(500).json({ error: error.message });
    }
};
