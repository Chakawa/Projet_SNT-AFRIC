const db = require('../config/db');

class Demande {
    static async create(demandeData) {
        const { userId, serviceId, typeDemande, adresse, disponibilite, creneauHoraire, details, gps_lat, gps_lng, pieces_jointes, priorite } = demandeData;

        // Vérification des valeurs
        if (!userId || !serviceId || !typeDemande || !adresse || !disponibilite || !creneauHoraire || !details) {
            throw new Error('Toutes les valeurs sont requises');
        }

        const [result] = await db.execute(
            'INSERT INTO demandes (user_id, service_id, type_demande, adresse, disponibilite, creneau_horaire, details, gps_lat, gps_lng, pieces_jointes, priorite) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, serviceId, typeDemande, adresse, disponibilite, creneauHoraire, details, gps_lat || null, gps_lng || null, pieces_jointes || null, priorite || 'normale']
        );
        return result.insertId;
    }

    static async getByUserId(userId) {
        const [rows] = await db.execute(
            'SELECT * FROM demandes WHERE user_id = ? AND archive = FALSE',
            [userId]
        );
        return rows;
    }
    
}

module.exports = Demande;
