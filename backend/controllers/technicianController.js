const db = require('../config/db');

exports.getAssignedDemands = async (req, res) => {
    const { userId } = req;
    try {
        const [rows] = await db.execute(
            'SELECT d.* FROM demandes d JOIN affectations a ON d.id = a.demande_id WHERE a.technicien_id = ?',
            [userId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Get Assigned Demands error:', error);
        res.status(500).json({ error: error.message });
    }
};
