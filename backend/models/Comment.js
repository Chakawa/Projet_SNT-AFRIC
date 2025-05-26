const db = require('../config/db');

class Comment {
    static async create(commentData) {
        const { userId, demandeId, contenu } = commentData;
        const [result] = await db.execute(
            'INSERT INTO commentaires (user_id, demande_id, contenu) VALUES (?, ?, ?)',
            [userId, demandeId, contenu]
        );
        return result.insertId;
    }

    static async getByDemandeId(demandeId) {
        const [rows] = await db.execute('SELECT * FROM commentaires WHERE demande_id = ?', [demandeId]);
        return rows;
    }
}

module.exports = Comment;