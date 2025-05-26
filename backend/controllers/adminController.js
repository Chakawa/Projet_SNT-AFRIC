const db = require('../config/db');

exports.getAllDemands = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM demandes');
        res.json(rows);
    } catch (error) {
        console.error('Get All Demands error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.assignTechnician = async (req, res) => {
    const { demandeId, technicienId } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO affectations (demande_id, technicien_id) VALUES (?, ?)',
            [demandeId, technicienId]
        );
        res.status(201).json({ message: 'Technicien assigné avec succès' });
    } catch (error) {
        console.error('Assign Technician error:', error);
        res.status(500).json({ error: error.message });
    }
};